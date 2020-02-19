import * as reduxLoop from 'redux-loop';

import * as taggedUnion from '../lib/tagged-union';
import * as reduxHelpers from '../lib/redux-helpers';
import * as actionType from '../lib/action-type';
import * as future from '../lib/future';
import * as mentorApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as messageApi from '../api/messages';

import { Env } from './env';

function id<A>(): (a: A) => A {
  return a => a;
}

export const mentors = reduxHelpers.makeActionCreators(
  mentorApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);

const accessToken = {
  ...actionType.make('login', id<authApi.AccessToken>()),
  ...actionType.make('refreshAccessToken'),
  ...actionType.make(
    'refreshAccessTokenCompleted',
    id<future.ToResult<ReturnType<typeof authApi.refreshAccessToken>>>(),
  ),
};

const buddies = {
  ...actionType.make(
    'fetchBuddiesCompleted',
    id<future.ToResult<ReturnType<typeof buddyApi.fetchBuddies>>>(),
  ),
};

const messages = {
  ...actionType.make('fetchMessages'),
  ...actionType.make(
    'fetchMessagesCompleted',
    id<future.ToResult<ReturnType<typeof messageApi.fetchMessages>>>(),
  ),
};

const sendMessage = {
  ...actionType.make('sendMessage', id<messageApi.SendMessageParams>()),
  sendMessageCompleted: (buddyId: string) => (
    response: future.ToResult<ReturnType<typeof messageApi.sendMessage>>,
  ) => ({
    type: 'sendMessageCompleted' as const,
    payload: { buddyId, response },
  }),
};

export type SchedulerAction = actionType.ActionsUnion<
  keyof typeof scheduler,
  typeof scheduler
>;
const scheduler = {
  ...actionType.make('startPolling', (action: NonSchedulerAction, delay) => ({
    action,
    delay,
  })),
  ...actionType.make(
    'poll',
    (actionName: NonSchedulerAction['type']) => actionName,
  ),
  ...actionType.make(
    'pollComplete',
    (actionName: NonSchedulerAction['type']) => actionName,
  ),
};

export type FinalReturn<F> = F extends (...args: any[]) => infer R
  ? R extends (...args: any[]) => infer S
    ? S
    : R
  : never;

export type MiddleParameters<F> = F extends (...args: any[]) => infer R
  ? R extends (...args: infer A) => any
    ? A
    : never
  : never;

type Creators = typeof _creators;

export const requestWithToken = {
  ...actionType.make(
    'requestWithToken',
    <
      FuncName extends keyof Env,
      ACName extends NonSchedulerAction['type']
    >(ops: {
      funcName: FuncName;
      funcArgs: Parameters<ReturnType<Env[FuncName]>>;

      actionCreatorName: [FinalReturn<Env[FuncName]>] extends MiddleParameters<
        Creators[ACName]
      >
        ? ACName
        : number;
      actionCreatorArgs: Parameters<Creators[ACName]>;
    }) => ops,
  ),
};

type NonSchedulerAction = actionType.ActionsUnion<
  keyof typeof _creators,
  typeof _creators
>;
export const _creators = {
  ...mentors,
  ...accessToken,
  ...buddies,
  ...messages,
  ...sendMessage,
};

export type Action = SchedulerAction | NonSchedulerAction;
export const creators = {
  ..._creators,
  ...scheduler,
};

export type LS<S> = S | reduxLoop.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;

export function match<S>(state: S, action: Action) {
  return (matchers: Partial<taggedUnion.MatcherRecord<Action, LS<S>>>) =>
    taggedUnion.match<Action, LS<S>>(action, {
      ...matchers,
      default() {
        return state;
      },
    });
}
