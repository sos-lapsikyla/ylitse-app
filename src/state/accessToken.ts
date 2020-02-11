import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as taggedUnion from '../lib/tagged-union';
import * as result from '../lib/result';
import * as refreshable from '../lib/remote-data-refreshable';
import * as http from '../lib/http';

import * as authApi from '../api/auth';

import * as actions from './actions';

export type State = Exclude<
  refreshable.Refreshable<authApi.AccessToken, http.Err>,
  refreshable.Err<http.Err> | refreshable.Loading
>;

export const initialState = refreshable.notAsked;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'login':
      return refreshable.ok(action.payload);
    case 'refreshAccessToken':
      switch (state.type) {
        case 'NotAsked':
        case 'Refreshing':
          return state;
        case 'Ok':
        case 'RefreshingFailure':
          const { value: accessToken } = state;
          // To omit unnecessary requests
          if (action.payload.accessToken !== accessToken.accessToken) {
            return reduxLoop.loop(
              state,
              reduxLoop.Cmd.action(
                actions.creators.refreshAccessTokenCompleted(
                  result.ok(accessToken),
                ),
              ),
            );
          }
          return reduxLoop.loop(
            refreshable.refreshing(accessToken),
            reduxLoop.Cmd.run(authApi.refreshAccessToken, {
              args: [accessToken],
              successActionCreator:
                actions.creators.refreshAccessTokenCompleted,
            }),
          );
        default:
          return assertNever(state);
      }
    case 'refreshAccessTokenCompleted':
      if (state.type === 'NotAsked') {
        return state;
      }
      return taggedUnion.match(action.payload, {
        Ok: ({ value: token }) => refreshable.ok(token),
        Err: ({ error }) => refreshable.refreshingFailure(state.value, error),
      });
    default:
      return state;
  }
};
