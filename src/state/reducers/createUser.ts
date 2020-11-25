import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import { cmd } from '../middleware';
import * as actions from '../actions';
import * as types from '../types';

export type State = types.AppState['login'];

export const initialState = RD.initial;

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'createUser/start':
      return automaton.loop(
        RD.pending,
        cmd(
          pipe(
            accountApi.createUser(action.payload),
            T.map(actions.make('createUser/end')),
          ),
        ),
      );
    case 'createUser/end':
      return pipe(
        action.payload,
        E.fold<
          string,
          authApi.AccessToken,
          automaton.Loop<State, actions.Action> | State
        >(
          (e) => RD.failure(e),
          (token) =>
            automaton.loop(
              RD.success(token),
              pipe(token, actions.make('token/Acquired')),
            ),
        ),
      );
    default:
      return state;
  }
};
