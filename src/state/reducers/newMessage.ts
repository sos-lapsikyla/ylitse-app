import { loop } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as record from 'fp-ts/lib/Record';
import * as array from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { cmd } from '../middleware';

import * as messageApi from '../../api/messages';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export type State = AppState['newMessage'];

type NewMessage = AppState['newMessage'][string];
type get = (buddyId: string) => (appState: AppState) => O.Option<NewMessage>;

const get: get =
  buddyId =>
  ({ newMessage }) =>
    record.lookup(buddyId, newMessage);

type NewMessageState = {
  isPending: boolean;
  messageContent: string;
  isSendingDisabled: boolean;
};
type getMessage = (buddyId: string) => (appState: AppState) => NewMessageState;
export const getMessage: getMessage = (buddyId: string) =>
  flow(
    get(buddyId),
    O.map(({ text, sendRequest }) => ({
      isPending: RD.isPending(sendRequest),
      messageContent: text,
      isSendingDisabled: text === '' || RD.isPending(sendRequest),
    })),
    O.getOrElse<NewMessageState>(() => ({
      isPending: false,
      messageContent: '',
      isSendingDisabled: false,
    })),
  );

const getPrev = (buddyId: string, state: State) =>
  O.getOrElse<NewMessage>(() => ({
    sendRequest: RD.initial,
    text: '',
    storeRequest: RD.initial,
  }))(record.lookup(buddyId, state));

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'buddies/completed': {
      const actionList = pipe(
        O.fromEither(action.payload),
        O.map(record.keys),
        O.getOrElse<string[]>(() => []),
        array.map(buddyId => ({ buddyId })),
        array.map(actions.make('newMessage/store/read/start')),
      );

      return loop(state, ...actionList);
    }
    case 'newMessage/store/read/start': {
      const { buddyId } = action.payload;

      const nextAction = cmd(
        pipe(
          messageApi.readMessage(buddyId),
          T.map(text =>
            actions.make('newMessage/store/read/end')({ buddyId, text }),
          ),
        ),
      );

      return loop(state, nextAction);
    }
    case 'newMessage/store/read/end': {
      const { buddyId, text } = action.payload;

      const next: NewMessage = {
        sendRequest: RD.initial,
        text,
      };

      return record.insertAt(buddyId, next)(state);
    }
    case 'newMessage/store/write/start': {
      const { buddyId, text } = action.payload;
      const prev = getPrev(buddyId, state);

      if (text === prev.text || RD.isPending(prev.sendRequest)) {
        return state;
      }

      const next: NewMessage = {
        sendRequest: RD.initial,
        text,
      };

      const nextState = record.insertAt(buddyId, next)(state);

      const nextAction = cmd(
        T.delay(250)(
          T.of(actions.make('newMessage/store/write/end')(action.payload)),
        ),
      );

      return loop(nextState, nextAction);
    }
    case 'newMessage/store/write/end': {
      const { buddyId, text } = action.payload;
      const prev = getPrev(buddyId, state);

      if (prev.text !== text) {
        return state;
      }

      const next: NewMessage = { ...prev };
      const nextState = record.insertAt(buddyId, next)(state);

      const nextAction = cmd(
        pipe(
          messageApi.storeMessage(action.payload),
          T.map(_ => actions.none),
        ),
      );

      return loop(nextState, nextAction);
    }
    case 'newMessage/send/start': {
      const { buddyId, text } = action.payload;

      const isLoading = pipe(
        record.lookup(buddyId, state),
        O.fold(
          () => false,
          ({ sendRequest }) => RD.isPending(sendRequest),
        ),
      );

      if (isLoading) {
        return state;
      }

      const nextState: State = {
        ...state,
        [buddyId]: {
          sendRequest: RD.pending,
          text,
        },
      };

      const nextAction = withToken(
        token =>
          T.task.map(
            messageApi.sendMessage(action.payload)(token),
            response => ({ response, buddyId, text }),
          ),
        actions.make('newMessage/send/end'),
      );

      return loop(nextState, nextAction);
    }
    case 'newMessage/send/end': {
      const { buddyId, response, text } = action.payload;

      const sentSuccessFully = RD.isSuccess(RD.fromEither(response));
      const nextText = sentSuccessFully ? '' : text;

      const result = {
        ...state[buddyId],
        text: nextText,
        sendRequest: RD.fromEither(response),
      };

      const nextAction = cmd(
        T.of(
          actions.make('newMessage/store/write/end')({
            buddyId,
            text: nextText,
          }),
        ),
      );

      return loop(
        {
          ...state,
          [buddyId]: result,
        },
        nextAction,
      );
    }
    default: {
      return state;
    }
  }
};
