import * as reduxLoop from 'redux-loop';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as http from '../lib/http';
import * as retryable from '../lib/remote-data-retryable';
import * as future from '../lib/future';
import * as taggedUnion from '../lib/tagged-union';

import * as actions from './actions';
type Args = Parameters<typeof buddyApi.fetchBuddies>;
export type State = retryable.Retryable<
  [buddyApi.Buddy[], Exclude<State, retryable.Ok<unknown, unknown[]>>],
  http.Err,
  Args
>;
type LoopState = actions.LS<State>;

export const initialState = retryable.notAsked;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchBuddies: ({ payload: [accessToken] }) =>
          toLoading(accessToken, retryable.loading),
      });
    case 'Loading':
      return matchAction({
        fetchBuddiesCompleted: ({ payload: buddies }) =>
          taggedUnion.match(buddies, {
            Ok: ({ value }) =>
              retryable.ok([value, retryable.notAsked], state.args),
            Err: ({ error }) => tryAccessTokenRefresh(state, error),
          }),
      });
    case 'Deferred':
      return matchAction({
        refreshAccessTokenCompleted: ({ payload: token }) =>
          taggedUnion.match(token, {
            Ok: ({ value }) => toLoading(value, retryable.retrying),
            Err: ({ error }) => retryable.err(error, state.args),
          }),
      });
    case 'Retrying':
      return matchAction({
        fetchBuddiesCompleted: ({ payload: buddies }) =>
          taggedUnion.match(buddies, {
            Ok: ({ value }) =>
              retryable.ok([value, retryable.notAsked], state.args),
            Err: ({ error }) => retryable.err(error, state.args),
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
  { args }: Extract<State, retryable.Loading<Args>>,
  err: http.Err,
): LoopState {
  const defaultError = retryable.err(err, args);
  return taggedUnion.match<http.Err, LoopState>(err, {
    BadStatus: ({ status }) =>
      status === 401
        ? reduxLoop.loop(
            retryable.deferred(args),
            reduxLoop.Cmd.action(actions.creators.refreshAccessToken(args[0])),
          )
        : defaultError,
    default: () => defaultError,
  });
}
