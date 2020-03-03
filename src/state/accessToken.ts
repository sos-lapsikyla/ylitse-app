import * as reduxLoop from 'redux-loop';
import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';

import * as err from '../lib/http-err';

import * as authApi from '../api/auth';

import * as actions from './actions';
import { AppState } from './model';

export type State = AppState['accessToken'];

export const initialState = O.none;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  const matchAction = actions.match(state, action);
  return pipe(
    state,
    O.fold(
      constant(
        matchAction({
          accessTokenAcquired: ({ payload }) => O.some(payload),
        }),
      ),
      prevToken => O.some(prevToken),
    ),
  );
};

function tokenReducer(
  currentToken: authApi.AccessToken,
  state: RD.RemoteData<err.Err, authApi.AccessToken>,
  action: actions.Action,
): actions.LS<RD.RemoteData<err.Err, authApi.AccessToken>> {
  const matchAction = actions.match(state, action);
  const init = matchAction({
    refreshAccessToken: reduxLoop.loop(
      RD.pending,
      reduxLoop.Cmd.run(authApi.refreshAccessToken(currentToken), {
        successActionCreator: actions.creators.refreshAccessTokenCompleted,
      }),
    ),
  });
  const complete = matchAction({
    refreshAccessTokenCompleted: ({ payload }) => RD.fromEither(payload),
  });
  return pipe(
    state,
    RD.fold(() => init, () => complete, () => init, () => state),
  );
}
