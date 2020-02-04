import * as stateHandlers from '../lib/state-handlers';

import * as buddyApi from '../api/buddies';

export const { actions, reducer } = stateHandlers.makeRemoteDataStateHandlers(
  buddyApi.fetchBuddies,
  'fetchBuddies',
  'fetchBuddiesFail',
  'fetchBuddiesSucceed',
);
