import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as record from 'fp-ts/lib/Record';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import * as messageApi from '../../api/messages';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export type State = AppState['newMessage'];

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'newMessage/send/start': {
      const buddyId = action.payload.buddyId;
      const isLoading = pipe(
        record.lookup(buddyId, state),
        O.fold(() => false, ({ sendRequest }) => RD.isPending(sendRequest)),
      );

      if (isLoading) {
        return state;
      }

      const nextState: State = {
        ...state,
        [buddyId]: {
          sendRequest: RD.pending,
          storeText: RD.initial,
          text: '',
        },
      };
      const nextAction = withToken(
        token =>
          T.task.map(
            messageApi.sendMessage(action.payload)(token),
            response => ({ response, buddyId }),
          ),
        actions.make('newMessage/send/end'),
      );
      return automaton.loop(nextState, nextAction);
    }
    case 'newMessage/send/end': {
      const { buddyId, response } = action.payload;

      const result = {
        ...state[buddyId],
        sendRequest: RD.fromEither(response),
      };
      return {
        ...state,
        [buddyId]: result,
      };
    }
    default: {
      return state;
    }
  }
};
