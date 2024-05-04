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
    case 'messages/markSeen': {
      const hasMessages = action.payload.messages.length > 0;

      if (!hasMessages) {
        return automaton.loop(state, {
          type: 'messages/markSeen/end',
          payload: undefined,
        });
      }

      const [first, ...messages] = action.payload.messages;

      console.log('markSeen action for message', first.content);

      const nextState =
        first.messageId in state || first.isSeen || first.type === 'Sent'
          ? state
          : { ...state, [first.messageId]: true };

      const markSeenTask = api.markSeen(first);

      return automaton.loop(
        nextState,
        withToken(markSeenTask, () => ({
          type: 'messages/markSeen',
          payload: { messages },
        })),
      );
    }

    default: {
      return state;
    }
  }
};
