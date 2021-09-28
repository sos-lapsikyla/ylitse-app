import * as automaton from 'redux-automaton';
import * as actions from '../actions';
import * as types from '../types';
export const initialState = false;

export const hideReducer: automaton.Reducer<boolean, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'hideVacationing/toggle':
      return !state;

    default:
      return state;
  }
};

export const select = ({ hideVacationing: state }: types.AppState) => state;
