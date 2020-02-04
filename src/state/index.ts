import * as reduxLoop from 'redux-loop';

import * as actionsUnion from '../lib/actions-union';
import * as stateHandlers from '../lib/state-handlers';

import * as accountApi from '../api/account';

import { State } from './state';
import * as accessToken from './accessToken';
import * as buddies from './buddies';
import * as mentors from './mentors';

export * from './state';

const {
  actions: credentialsSanityCheckActions,
  reducer: credentialsSanityCheckReducer,
} = stateHandlers.makeRemoteDataStateHandlers(
  accountApi.makeCredentialsSanityCheck,
  'requestCredentialsSanityCheck',
  'credentialsSanityCheckFail',
  'credentialsSanityCheckSucceed',
  'resetCredentialsSanityCheck',
);

export type Action =
  | actionsUnion.ActionsUnion<keyof typeof actions, typeof actions>
  | stateHandlers.UnknownAction;
export const actions = {
  ...mentors.actions,
  ...buddies.actions,
  ...credentialsSanityCheckActions,
  ...accessToken.actions,
};

export const reducer = reduxLoop.combineReducers<State, Action>({
  accessToken: accessToken.reducer,
  mentors: mentors.reducer,
  buddies: buddies.reducer,
  credentialsSanityCheck: credentialsSanityCheckReducer,
});
