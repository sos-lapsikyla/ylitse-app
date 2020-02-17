import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as http from '../lib/http';
import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as future from '../lib/future';
import * as result from '../lib/result';
import * as taggedUnion from '../lib/tagged-union';
import * as tuple from '../lib/tuple';

import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';

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
) => _reducer({ accessToken: token, buddies: state }, state, action);

type Env = {
  accessToken: authApi.AccessToken;
  buddies: State;
};

/*
                Ok
                Ok: ({ value: threads }) => {

              if (env.buddies.type !== 'Ok') return state;
              const [ currentBuddies ] = env.buddies.value;
              if (currentBuddies.every(buddy => buddy.userId in threads)) {
                return state;
              }
              return toFetching(env.accessToken, remoteData.loading);
*/

export function _reducer(
  env: Env,
  state: State = initialState,
  action: actions.Action,
): LoopState {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchMessagesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: ({ value: threads }) => {
              if (
                env.buddies.type !== 'Ok' ||
                tuple
                  .fst(env.buddies.value)
                  .some(buddy => !(buddy.userId in threads))
              ) {
                return toFetching(env.accessToken, remoteData.loading);
              }
              return state;
            },
            Err: state,
          }),
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
        _reducer({ ...env, buddies: state }, request, action),
      );
      const nextState: State =
        nextBuddies.type === 'Ok'
          ? nextBuddies
          : remoteData.ok(tuple.tuple(buddies, nextBuddies));
      return reduxLoop.loop(nextState, cmd);
    default:
      return assertNever(state);
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
