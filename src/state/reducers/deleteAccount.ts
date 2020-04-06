import { Reducer, loop } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import * as accountApi from '../../api/account';

import { make, Action } from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;

type State = AppState['deleteAccount'];

export const reducer: Reducer<AppState['deleteAccount'], Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'deleteAccount/start': {
      return loop(
        RD.pending,
        withToken(accountApi.deleteAccount, make('deleteAccount/end')),
      );
    }
    case 'deleteAccount/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => loop<State, Action>(RD.failure(fail)),
          _ => loop(RD.success(undefined), make('logout/logout')(undefined)),
        ),
      );
    }
    default: {
      return state;
    }
  }
};
