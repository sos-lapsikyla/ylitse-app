import * as automaton from 'redux-automaton';
import * as R from 'fp-ts-rxjs/lib/Observable';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';

import * as accountApi from '../api/account';
import * as authApi from '../api/auth';
import * as err from '../lib/http-err';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['login'];

export const initialState = RD.initial;

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'createUser':
      return automaton.loop(
        RD.pending,
        actions.creators.fetchCmd(
          constant(
            pipe(
              accountApi.createUser(action.payload),
              R.map(actions.creators.createUserCompleted),
            ),
          ),
        ),
      );
    case 'createUserCompleted':
      return pipe(
        action.payload,
        E.fold<
          err.Err,
          authApi.AccessToken,
          automaton.Loop<State, actions.Action> | State
        >(
          e => RD.failure(e),
          token =>
            automaton.loop(
              RD.success(token),
              actions.creators.accessTokenAcquired(token),
            ),
        ),
      );
    default:
      return state;
  }
};
