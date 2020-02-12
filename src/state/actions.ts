import * as reduxLoop from 'redux-loop';

import * as taggedUnion from '../lib/tagged-union';
import * as reduxHelpers from '../lib/redux-helpers';
import * as actionType from '../lib/action-type';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as timestamped from '../lib/timestamped';

import * as mentorApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';

const time = {
  ...actionType.make('startTicking'),
  tick: (timestamp: timestamped.Timestamped) =>
    actionType.make('tick', timestamp),
};

export const mentors = reduxHelpers.makeActionCreators(
  mentorApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);

const accessToken = {
  login: (token: authApi.AccessToken) => actionType.make('login', token),
  refreshAccessToken: (token: authApi.AccessToken) =>
    actionType.make('refreshAccessToken', token),
  refreshAccessTokenCompleted: (
    token: result.Result<authApi.AccessToken, http.Err>,
  ) => actionType.make('refreshAccessTokenCompleted', token),
};

const buddies = reduxHelpers.makeActionCreators(
  buddyApi.fetchBuddies,
  'fetchBuddies',
  'fetchBuddiesCompleted',
  'fetchBuddiesReset',
);

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;

export const creators = {
  ...time,
  ...mentors,
  ...accessToken,
  ...buddies,
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
