import * as reduxLoop from 'redux-loop';
import * as E from 'fp-ts/lib/Either';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as authApi from '../api/auth';
import * as err from '../lib/http-err';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['login'];

export const initialState = RD.initial;

export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'login':
      return reduxLoop.loop(
        RD.pending,
        reduxLoop.Cmd.run(authApi.login(action.payload), {
          successActionCreator: actions.creators.loginCompleted,
        }),
      );
    case 'loginCompleted':
      return pipe(
        action.payload,
        E.fold<
          err.Err,
          authApi.AccessToken,
          reduxLoop.Loop<State, actions.Action> | State
        >(
          e => RD.failure(e),
          token =>
            reduxLoop.loop(
              RD.success(token),
              reduxLoop.Cmd.action(actions.creators.accessTokenAcquired(token)),
            ),
        ),
      );
    default:
      return state;
  }
};
