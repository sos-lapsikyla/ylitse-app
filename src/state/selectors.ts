import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as option from '../lib/option';
import * as tuple from '../lib/tuple';

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
  remoteData.map(retryable.toRemoteData(buddies), tuple.fst);
export const getMentors = ({ mentors }: AppState) => mentors;
export const getAccessToken = ({ accessToken }: AppState) =>
  option.map(accessToken, tuple.fst);
