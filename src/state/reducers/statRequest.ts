import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;

type State = AppState['statRequest'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
