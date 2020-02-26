import * as reduxLoop from 'redux-loop';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

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
      return reduxLoop.loop(
        RD.pending,
        reduxLoop.Cmd.run(accountApi.createUser(action.payload), {
          successActionCreator: actions.creators.fetchMentorsCompleted,
        }),
      );
    case 'createUserCompleted':
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
