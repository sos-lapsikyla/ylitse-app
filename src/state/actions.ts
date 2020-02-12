import * as reduxLoop from 'redux-loop';

import * as reduxHelpers from '../lib/redux-helpers';
import * as actionType from '../lib/action-type';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as timestamped from '../lib/timestamped';

import * as mentorApi from '../api/mentors';
import * as accountApi from '../api/account';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';

export const time = {
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

export const createUser = reduxHelpers.makeActionCreators(
  accountApi.createUser,
  'createUser',
  'createUserCompleted',
  'createUserReset',
);

export const login = reduxHelpers.makeActionCreators(
  authApi.login,
  'login',
  'loginCompleted',
  'loginReset',
);

export const refreshAccessToken = {
  ...actionType.make('refreshAccessToken'),
  refreshAccessTokenCompleted: (
    token: result.Result<authApi.AccessToken, http.Err>,
  ) => actionType.make('refreshAccessTokenCompleted', token),
};

export const buddies = reduxHelpers.makeActionCreators(
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
  ...createUser,
  ...login,
  ...refreshAccessToken,
  ...buddies,
};

export type LS<S> = S | reduxLoop.Loop<S, Action>;
export type Reducer<S> = (state: S | undefined, action: Action) => LS<S>;
