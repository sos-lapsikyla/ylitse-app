import * as reduxLoop from 'redux-loop';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as http from '../lib/http';
import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as future from '../lib/future';
import * as result from '../lib/result';
import * as taggedUnion from '../lib/tagged-union';
import * as tuple from '../lib/tuple';

import * as actions from './actions';
export type State = retryable.Retryable<
  [buddyApi.Buddy[], Exclude<State, remoteData.Ok<unknown>>],
  http.Err
>;
export type LoopState = actions.LS<State>;

export const initialState = remoteData.notAsked;

const identity = <A>(a: A) => a;

export const reducer = (token: authApi.AccessToken) => (
  state: State = initialState,
  action: actions.Action,
) => _reducer(token, state, action);

export function _reducer(
  accessToken: authApi.AccessToken,
  state: State = initialState,
  action: actions.Action,
): LoopState {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchBuddies: () => toFetching(accessToken, remoteData.loading),
      });
    case 'Loading':
      return matchAction({
        fetchBuddiesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: toOk,
            Err: tryAccessTokenRefresh,
          }),
      });
    case 'Deferred':
      return matchAction({
        refreshAccessTokenCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: ({ value: token }) => toFetching(token, retryable.retrying),
            Err: identity,
          }),
      });
    case 'Retrying':
      return matchAction({
        fetchBuddiesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: toOk,
            Err: identity,
          }),
      });
    case 'Ok':
      const [buddies, request] = state.value;
      const [nextBuddies, cmd] = reduxLoop.liftState(
        _reducer(accessToken, request, action),
      );
      const nextState: State =
        nextBuddies.type === 'Ok'
          ? nextBuddies
          : remoteData.ok(tuple.tuple(buddies, nextBuddies));
      return reduxLoop.loop(nextState, cmd);
    default:
      return state;
  }
}

function toFetching(
  token: authApi.AccessToken,
  nextState: taggedUnion.Pick<State, 'Loading' | 'Retrying'>,
): LoopState {
  return reduxLoop.loop(
    nextState,
    reduxLoop.Cmd.run(future.lazy(buddyApi.fetchBuddies, token), {
      successActionCreator: actions.creators.fetchBuddiesCompleted,
    }),
  );
}

function toOk({ value: buddies }: result.Ok<buddyApi.Buddy[]>): LoopState {
  return remoteData.ok([buddies, remoteData.notAsked]);
}

function tryAccessTokenRefresh(err: result.Err<http.Err>): LoopState {
  return err.error.type === 'BadStatus' && err.error.status === 401
    ? reduxLoop.loop(
        retryable.deferred,
        reduxLoop.Cmd.action(actions.creators.refreshAccessToken()),
      )
    : err;
}
