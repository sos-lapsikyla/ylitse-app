import * as automaton from 'redux-automaton';
import * as actions from '../actions';
import * as types from '../types';

export type State = types.AppState['filterMentors'];
export const initialState = {
  skillFilter: [],
  hideInactiveMentors: false,
};

export const filterMentorsReducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'skillFilter/toggled':
      const skills = state.skillFilter.includes(action.payload.skillName)
        ? state.skillFilter.filter(skill => skill !== action.payload.skillName)
        : state.skillFilter.concat(action.payload.skillName);

      return { ...state, skillFilter: skills };

    case 'skillFilter/reset':
      return { ...state, skillFilter: [] };
    case 'onHideInactiveMentors/toggle':
      return { ...state, hideInactiveMentors: !state.hideInactiveMentors };
    default:
      return state;
  }
};

export const selectSearchParams = ({ filterMentors: state }: types.AppState) =>
  state;
