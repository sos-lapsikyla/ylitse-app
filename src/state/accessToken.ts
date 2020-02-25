import * as reduxLoop from 'redux-loop';
import * as option from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import assertNever from '../lib/assert-never';
import * as remoteData from '../lib/remote-data';
import * as http from '../lib/http';
import * as f from '../lib/future';

import * as authApi from '../api/auth';

import * as actions from './actions';
import { AppState } from './model';

export type State = AppState['accessToken'];

export const initialState = option.none;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  const matchAction = actions.match(state, action);
  return pipe(
    state,
    option.fold(
      () =>
        matchAction({
          login: ({ payload }) => option.some([payload, remoteData.notAsked]),
        }),
      ([currentToken, nextToken]) => {
        const [model, cmd] = reduxLoop.liftState(
          tokenReducer(currentToken, nextToken, action),
        );
        const nextState: AppState['accessToken'] =
          model.type === 'Ok'
            ? option.some([model.value, remoteData.notAsked])
            : option.some([currentToken, model]);
        return reduxLoop.loop(nextState, cmd);
      },
    ),
  );
};

function tokenReducer(
  currentToken: authApi.AccessToken,
  state: remoteData.RemoteData<authApi.AccessToken, http.Err>,
  action: actions.Action,
): actions.LS<remoteData.RemoteData<authApi.AccessToken, http.Err>> {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        refreshAccessToken: reduxLoop.loop(
          remoteData.loading,
          reduxLoop.Cmd.run(f.lazy(authApi.refreshAccessToken, currentToken), {
            successActionCreator: actions.creators.refreshAccessTokenCompleted,
          }),
        ),
      });
    case 'Loading':
      return matchAction({
        refreshAccessTokenCompleted: ({ payload }) => payload,
      });
    case 'Ok':
      return state;
    default:
      return assertNever(state);
  }
}
