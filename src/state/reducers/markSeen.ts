import * as automaton from 'redux-automaton';
import * as actions from '../actions';
import * as api from '../../api/messages';

import { withToken } from './accessToken';

type State = Record<string, boolean>;
export const initialState = {};

export const markSeen = actions.make('messages/markSeen');

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'messages/markSeen':
      const message = action.payload.message;
      const id = message.messageId;
      if (id in state || message.isSeen || message.type === 'Sent') {
        return state;
      }
      const markSeenTask = api.markSeen(action.payload.message);
      return automaton.loop(
        { ...state, [id]: true },
        withToken(markSeenTask, () => ({
          type: 'messages/markSeen/end',
          payload: undefined,
        })),
      );
    default:
      return state;
  }
};
