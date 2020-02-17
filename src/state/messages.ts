import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as retryable from '../lib/remote-data-retryable';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as future from '../lib/future';
import * as remoteData from '../lib/remote-data';
import * as taggedUnion from '../lib/tagged-union';
import * as tuple from '../lib/tuple';

import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';

import * as actions from './actions';

/*
 * Buddies
 * { [buddyId]: displayName }
 */

export type Env = {
  accessToken: authApi.AccessToken;
};

export type State = retryable.Retryable<
  [messageApi.Threads, Exclude<State, remoteData.Ok<unknown>>],
  http.Err
>;
export type LoopState = actions.LS<State>;
export const initialState = remoteData.notAsked;

export const reducer = (env: Env) => (state: State, action: actions.Action) =>
  _reducer(env, state, action);

function _reducer(
  env: Env,
  state: State = initialState,
  action: actions.Action,
): LoopState {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        fetchMessages: toFetching(env.accessToken, remoteData.loading),
      });
    case 'Loading':
      return matchAction({
        fetchMessagesCompleted: ({ payload }) =>
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
        fetchMessagesCompleted: ({ payload }) =>
          taggedUnion.match(payload, {
            Ok: toOk,
            Err: identity,
          }),
      });
    case 'Ok':
      const [messages, request] = state.value;
      const [nextMessages, cmd] = reduxLoop.liftState(
        _reducer(env, request, action),
      );
      const nextState: State =
        nextMessages.type === 'Ok'
          ? nextMessages
          : remoteData.ok(tuple.tuple(messages, nextMessages));
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
    reduxLoop.Cmd.run(future.lazy(messageApi.fetchMessages, token), {
      successActionCreator: actions.creators.fetchMessagesCompleted,
    }),
  );
}

function toOk({ value: messages }: result.Ok<messageApi.Threads>): LoopState {
  return remoteData.ok([messages, remoteData.notAsked]);
}

function tryAccessTokenRefresh(err: result.Err<http.Err>): LoopState {
  return err.error.type === 'BadStatus' && err.error.status === 401
    ? reduxLoop.loop(
        retryable.deferred,
        reduxLoop.Cmd.action(actions.creators.refreshAccessToken()),
      )
    : err;
}

function identity<A>(a: A) {
  return a;
}
