import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as option from '../lib/option';
import * as tuple from '../lib/tuple';

import * as accessTokenState from './accessToken';
import * as buddiesState from './buddies';
import * as scheduler from './scheduler';
import * as mentorsState from './mentors';

export type AppState = {
  accessToken: accessTokenState.State;
  buddies: buddiesState.State;
  mentors: mentorsState.State;
  scheduler: scheduler.State;
};

export const getBuddies = ({ buddies }: AppState) =>
  remoteData.map(retryable.toRemoteData(buddies), tuple.fst);
export const getMentors = ({ mentors }: AppState) => mentors;
export const getAccessToken = ({ accessToken }: AppState) =>
  option.map(accessToken, tuple.fst);
