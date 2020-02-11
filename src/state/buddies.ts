import * as reduxLoop from 'redux-loop';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as http from '../lib/http';
import * as remoteData from '../lib/remote-data';
import * as refreshable from '../lib/remote-data-retryable-refreshable';
import * as future from '../lib/future';
import * as taggedUnion from '../lib/tagged-union';

import * as actions from './actions';
type Args = Parameters<typeof buddyApi.fetchBuddies>;
export type State = refreshable.RetryableRefreshable<
  buddyApi.Buddy[],
  http.Err,
  Args
>;
type LoopState = actions.LS<State>;

export const initialState = remoteData.notAsked;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  const matchAction = (
    matchers: Partial<taggedUnion.MatcherRecord<actions.Action, LoopState>>,
  ) =>
    taggedUnion.match<actions.Action, LoopState>(action, {
      ...matchers,
      default() {
        return state;
      },
    });
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchBuddies: ({ payload: [accessToken] }) =>
          toLoading(accessToken, refreshable.loading),
      });
    case 'Loading':
      return matchAction({
        fetchBuddiesCompleted: ({ payload: buddies }) =>
          taggedUnion.match(buddies, {
            Ok: ({ value }) => refreshable.ok(value, state.args),
            Err: ({ error }) => tryAccessTokenRefresh(state, error),
          }),
      });
    case 'Deferred':
      return matchAction({
        refreshAccessTokenCompleted: ({ payload: token }) =>
          taggedUnion.match(token, {
            Ok: ({ value }) => toLoading(value, refreshable.retrying),
            Err: ({ error }) => refreshable.err(error, state.args),
          }),
      });
    case 'Retrying':
      return matchAction({
        fetchBuddiesCompleted: ({ payload: buddies }) =>
          taggedUnion.match(buddies, {
            Ok: ({ value }) => refreshable.ok(value, state.args),
            Err: ({ error }) => refreshable.err(error, state.args),
          }),
      });
    case 'Ok':
      return state;
    default:
      return state;
  }
};

function toLoading(
  token: authApi.AccessToken,
  toState: (t: [authApi.AccessToken]) => State,
): LoopState {
  return reduxLoop.loop(
    toState([token]),
    reduxLoop.Cmd.run(future.lazy(buddyApi.fetchBuddies, token), {
      successActionCreator: actions.creators.fetchBuddiesCompleted,
    }),
  );
}

function tryAccessTokenRefresh(
  { args }: Extract<State, refreshable.Loading<Args>>,
  err: http.Err,
): LoopState {
  const defaultError = refreshable.err(err, args);
  return taggedUnion.match<http.Err, LoopState>(err, {
    BadStatus: ({ status }) =>
      status === 401
        ? reduxLoop.loop(
            refreshable.deferred(args),
            reduxLoop.Cmd.action(actions.creators.refreshAccessToken(args[0])),
          )
        : defaultError,
    default: () => defaultError,
  });
}
