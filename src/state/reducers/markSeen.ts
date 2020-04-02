import * as automaton from 'redux-automaton';

import * as actions from '../actions';

type State = Record<string, 'Requested'>;
export const initialState = {};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'messages/markSeen':
      return state;
    default:
      return state;
  }
};
