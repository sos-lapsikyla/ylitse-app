import * as automaton from 'redux-automaton';
import * as O from 'fp-ts/lib/Option';
import { flow } from 'fp-ts/lib/function';
import { Observable } from 'rxjs';

import * as authApi from '../api/auth';

import * as actions from './actions';
import { AppState } from './model';
import * as selectors from './selectors';

export type State = AppState['accessToken'];

export const initialState = O.none;

export const withToken: (
  f: (token: authApi.AccessToken) => Observable<actions.RegularAction>,
) => actions.Action = f =>
  actions.creators.fetchCmd(
    flow(
      selectors.getAC,
      f,
    ),
  );

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  if (!O.isSome(state)) {
    return action.type !== 'accessTokenAcquired'
      ? state
      : O.some({
          currentToken: action.payload,
          nextToken: { type: 'NotAsked' },
        });
  }
  return state;
};
