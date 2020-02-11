import * as refreshable from '../lib/remote-data-retryable-refreshable';

import * as accessTokenState from './accessToken';
import * as buddiesState from './buddies';
import * as mentorsState from './mentors';
import * as timeState from './time';

export type AppState = {
  accessToken: accessTokenState.State;
  time: timeState.State;
  buddies: buddiesState.State;
  mentors: mentorsState.State;
};

export const getBuddies = ({ buddies }: AppState) =>
  refreshable.toRemoteData(buddies);
export const getMentors = ({ mentors }: AppState) => mentors;
export const getAccessToken = ({ accessToken }: AppState) => accessToken;
