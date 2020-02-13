import * as reduxLoop from 'redux-loop';

import * as taggedUnion from '../lib/tagged-union';
import * as reduxHelpers from '../lib/redux-helpers';
import * as actionType from '../lib/action-type';
import * as http from '../lib/http';
import * as result from '../lib/result';
import * as mentorApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';

export const mentors = reduxHelpers.makeActionCreators(
  mentorApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsCompleted',
  'fetchMentorsReset',
);

const accessToken = {
  ...actionType.make('login', (token: authApi.AccessToken) => token),
  ...actionType.make('refreshAccessToken'),
  ...actionType.make(
    'refreshAccessTokenCompleted',
    (response: result.Result<authApi.AccessToken, http.Err>) => response,
  ),
};

const buddies = {
  ...actionType.make('fetchBuddies', (token: authApi.AccessToken) => token),
  ...actionType.make(
    'fetchBuddiesCompleted',
    (response: result.Result<buddyApi.Buddy[], http.Err>) => response,
  ),
};

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export const creators = {
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
