import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';
import * as statApi from '../../api/stat';

export const initialState = RD.initial;

type State = AppState['statRequest'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'statRequest/start': {
      return automaton.loop(
        state,
        withToken(
          statApi.sendStat(action.payload),
          actions.make('statRequest/end'),
        ),
      );
    }

    case 'statRequest/end': {
      return state;
    }
    default: {
      return state;
    }
  }
};
