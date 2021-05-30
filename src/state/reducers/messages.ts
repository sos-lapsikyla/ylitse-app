import * as automaton from 'redux-automaton';
import * as ord from 'fp-ts/lib/Ord';
import * as O from 'fp-ts/lib/Option';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as array from 'fp-ts/lib/Array';
import { flow, identity } from 'fp-ts/lib/function';
import * as record from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';

import * as messageApi from '../../api/messages';
import * as config from '../../api/config';

import * as actions from '../actions';
import * as types from '../types';

import { withToken } from './accessToken';
import { getIsBanned } from '../selectors';

export type State = types.AppState['messages'];
export type LoopState = actions.LS<State>;

export const initialState = {
  polling: false,
  messages: RD.initial,
};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'token/Acquired': {
      return !RD.isInitial(state.messages)
        ? state
        : automaton.loop(
            { polling: true, messages: RD.pending },
            withToken(
              messageApi.fetchMessages,
              actions.make('messages/get/completed'),
            ),
          );
    }
    case 'messages/get/completed': {
      if (!state.polling) {
        return state;
      }
      const nextState = {
        ...state,
        messages: RD.remoteData.alt(
          RD.fromEither(action.payload),
          () => state.messages,
        ),
      };

      const nextCmd = withToken(
        flow(
          messageApi.fetchMessages,
          T.delay(config.messageFetchDelay),
        ),
        actions.make('messages/get/completed'),
      );
      return automaton.loop(nextState, nextCmd);
    }
    default:
      return state;
  }
};

const getMessages = ({ messages: { messages } }: types.AppState) =>
  RD.toOption(messages);

export const getMessagesByBuddyId = (buddyId: string) => (
  appState: types.AppState,
) =>
  pipe(
    getMessages(appState),
    O.chain(r => record.lookup(buddyId, r)),
    O.map(r => Object.values(r)),
    O.fold(() => [], identity),
  );

export const ordMessage: ord.Ord<messageApi.Message> = ord.fromCompare((a, b) =>
  ord.ordNumber.compare(a.sentTime, b.sentTime),
);

export const hasUnseen: (
  buddyId: string,
) => (appState: types.AppState) => boolean = buddyId => appState =>
  pipe(
    getMessagesByBuddyId(buddyId)(appState),
    array.sort(ordMessage),
    array.last,
    O.map(
      ({ type, isSeen }) =>
        type === 'Received' &&
        isSeen === false &&
        !getIsBanned(buddyId)(appState),
    ),
    O.fold(() => false, identity),
  );

export const isAnyMessageUnseen = (appState: types.AppState) =>
  pipe(
    getMessages(appState),
    O.fold(() => ({}), identity),
    Object.keys,
    array.map(id => hasUnseen(id)(appState)),
    array.reduce(false, (a, b) => a || b),
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
      return last.sentTime;
    }),
  ),
);
