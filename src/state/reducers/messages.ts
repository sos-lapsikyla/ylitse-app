import * as automaton from 'redux-automaton';
import * as ord from 'fp-ts/lib/Ord';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import * as array from 'fp-ts/lib/Array';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import * as record from 'fp-ts/lib/Record';

import * as messageApi from '../../api/messages';
import * as buddyApi from '../../api/buddies';
import * as config from '../../api/config';

import * as actions from '../actions';
import * as types from '../types';

import { withToken } from './accessToken';
import { getIsBanned, getBuddyStatus } from '../selectors';

export type State = types.AppState['messages'];
export type LoopState = actions.LS<State>;
export type PollingParams =
  | {
      type: 'New';
      previousMsgId: string;
    }
  | { type: 'OlderThan'; buddyId: string; messageId: string }
  | { type: 'InitialMessages'; buddyIds: Array<string> };

export const initialState = {
  polling: false,
  messages: RD.initial,
  previousMsgId: '',
  pollingQueue: [],
  currentParams: { type: 'New' as const, previousMsgId: '' },
};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'messages/setPollingParams': {
      if (action.payload.type === 'InitialMessages') {
        const chunks = buddyApi.createFetchChunks(action.payload.buddyIds);
        const currentParams = chunks[0] ?? [];
        const nextPollingParams = chunks.slice(1);

        return automaton.loop(
          {
            ...state,
            polling: true,
            messages: RD.pending,
            pollingQueue: nextPollingParams,
            currentParams,
          },
          withToken(
            messageApi.fetchMessages(currentParams),
            actions.make('messages/get/completed'),
          ),
        );
      }

      return {
        ...state,
        pollingQueue: [action.payload, ...state.pollingQueue],
      };
    }

    case 'messages/get/completed': {
      if (!state.polling) {
        return state;
      }

      const newMessages = pipe(
        action.payload,
        E.fold(
          () => ({}),
          ({ messages }) => messages,
        ),
      );

      const currentMessages = pipe(
        state.messages,
        RD.getOrElse(() => ({})),
      );

      const nextMessages = messageApi.mergeMessageRecords(
        newMessages,
        currentMessages,
      );

      const previousMsgId = messageApi.extractMostRecentId(nextMessages);

      const isFetchingOlderMessagesAndIsOldestFetchedUnread =
        state.currentParams.type === 'OlderThan'
          ? messageApi.getIsOldestFetchedMessageUnread(
              newMessages[state.currentParams.buddyId],
            )
          : false;

      const [first, rest] = messageApi.getNextParams(
        action.payload,
        state.pollingQueue,
        state.currentParams,
        previousMsgId,
      );

      const { nextFetch, nextCurrent, nextQueue } =
        isFetchingOlderMessagesAndIsOldestFetchedUnread
          ? {
              nextCurrent: state.currentParams,
              nextFetch: state.currentParams,
              nextQueue: [first, ...rest],
            }
          : { nextCurrent: first, nextFetch: first, nextQueue: rest };

      const nextCmd = withToken(
        flow(
          messageApi.fetchMessages(nextFetch),
          T.delay(config.messageFetchDelay),
        ),
        actions.make('messages/get/completed'),
      );

      return automaton.loop(
        {
          ...state,
          messages: RD.success(nextMessages),
          previousMsgId,
          pollingQueue: nextQueue,
          currentParams: nextCurrent,
        },
        nextCmd,
      );
    }

    case 'buddies/completed': {
      if (!(E.isRight(action.payload) && RD.isSuccess(state.messages))) {
        return state;
      }

      const messages = messageApi.filterMessages(
        action.payload.right,
        state.messages.value,
      );

      const previousMsgId = messageApi.extractMostRecentId(messages);

      return { ...state, messages: RD.success(messages), previousMsgId };
    }

    case 'buddies/changeChatStatusBatch/end': {
      if (!(E.isRight(action.payload) && RD.isSuccess(state.messages))) {
        return state;
      }

      const responseBuddies = action.payload.right;
      const messages = state.messages.value;

      const notDeletedBuddies = Object.keys(responseBuddies).filter(
        buddyId => responseBuddies[buddyId].status !== 'deleted',
      );

      const nextBuddies = notDeletedBuddies.reduce<
        Record<string, buddyApi.Buddy>
      >((buddies, buddyId) => {
        return { ...buddies, [buddyId]: responseBuddies[buddyId] };
      }, {});

      const nextMessages = messageApi.filterMessages(nextBuddies, messages);

      return { ...state, messages: RD.success(nextMessages) };
    }

    case 'messages/markSeen': {
      const hasMessages = action.payload.messages.length > 0;
      if (!hasMessages) {
        return state;
      }

      const [first, ..._rest] = action.payload.messages;

      if (first.type === 'Sent' || first.isSeen === true) {
        return state;
      }

      const oldMessages = RD.isSuccess(state.messages)
        ? state.messages.value
        : {};

      const updatedMessage = {
        ...first,
        isSeen: true,
      };

      const updatedMessageRecord = {
        [first.buddyId]: {
          ...oldMessages[first.buddyId],
          [first.messageId]: updatedMessage,
        },
      };

      return {
        ...state,
        messages: RD.success(
          messageApi.mergeMessageRecords(oldMessages, updatedMessageRecord),
        ),
      };
    }

    default:
      return state;
  }
};

const getMessages = ({ messages: { messages } }: types.AppState) =>
  RD.toOption(messages);

export const getMessagesByBuddyId =
  (buddyId: string) => (appState: types.AppState) =>
    pipe(
      getMessages(appState),
      O.chain(r => record.lookup(buddyId, r)),
      O.map(r => Object.values(r)),
      O.fold(() => [], identity),
    );

export const getLastMessageByBuddyId =
  (buddyId: string) => (appState: types.AppState) => {
    const messages = pipe(
      getMessages(appState),
      O.chain(r => record.lookup(buddyId, r)),
      O.map(r => Object.values(r)),
      O.fold(() => [], identity),
      array.sort(ordMessage),
    );

    return messages[messages.length - 1]?.content ?? '';
  };

export const ordMessage: ord.Ord<messageApi.Message> = ord.fromCompare((a, b) =>
  ord.ordNumber.compare(a.sentTime, b.sentTime),
);
export const hasUnseen: (
  buddyId: string,
) => (appState: types.AppState) => boolean = buddyId => appState =>
  pipe(getMessagesByBuddyId(buddyId)(appState), messages =>
    messages.some(({ type, isSeen }) => type === 'Received' && !isSeen),
  );

export const isAnyMessageUnseen = (appState: types.AppState) =>
  pipe(
    getMessages(appState),
    O.fold(() => ({}), identity),
    Object.keys,
    array.map(id => hasUnseen(id)(appState)),
    array.reduce(false, (a, b) => a || b),
  );

export const hasUnseenMessagesOfStatus =
  (chatType: buddyApi.ChatStatus) => (appState: types.AppState) =>
    pipe(
      getMessages(appState),
      O.fold(() => ({}), identity),
      Object.keys,
      array.map(id => hasUnseenMessagesByType(id, chatType)(appState)),
      array.reduce(false, (a, b) => a || b),
    );
export const hasUnseenMessagesByType =
  (buddyId: string, chatType: buddyApi.ChatStatus) =>
  (appState: types.AppState) =>
    pipe(getMessagesByBuddyId(buddyId)(appState), messages =>
      messages.some(
        ({ type, isSeen }) =>
          type === 'Received' &&
          !isSeen &&
          getBuddyStatus(buddyId)(appState) === chatType,
      ),
    );
export const getMessage = (
  { messages: messageState }: types.AppState,
  index: {
    buddyId: string;
    messageId: string;
  },
) => {
  return pipe(
    RD.toOption(messageState.messages),
    O.chain(threads => record.lookup(index.buddyId, threads)),
    O.chain(threadMessages => record.lookup(index.messageId, threadMessages)),
  );
};

export const getOrder: (
  s: types.AppState,
) => RD.RemoteData<string, Record<string, number>> = flow(
  ({ messages }) => messages.messages,
  RD.map(
    record.map(messagesById => {
      const messages = Object.values(messagesById).sort(ordMessage.compare);
      const last = messages[messages.length - 1];

      return last?.sentTime ?? 0;
    }),
  ),
);

const isLoadingOlderMessages = (
  pollingParams: PollingParams,
  buddyId: string,
) => pollingParams.type === 'OlderThan' && pollingParams.buddyId === buddyId;

const isLoadingInitialMessages = (
  pollingParams: PollingParams,
  buddyId: string,
) =>
  pollingParams.type === 'InitialMessages' &&
  pollingParams.buddyIds.includes(buddyId);

export const isLoadingBuddyMessages =
  (buddyId: string) => (state: types.AppState) =>
    [state.messages.currentParams, ...state.messages.pollingQueue].some(
      param =>
        isLoadingOlderMessages(param, buddyId) ||
        isLoadingInitialMessages(param, buddyId),
    );
