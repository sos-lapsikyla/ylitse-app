import * as redux from 'redux';
import * as reduxLoop from 'redux-loop';

import * as actionsUnion from '../lib/actions-union';
import * as remoteData from '../lib/remote-data';
import * as stateHandlers from '../lib/state-handlers';

import * as accountApi from '../api/account';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as mentorsApi from '../api/mentors';

export type State = {
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  buddies: remoteData.RemoteData<buddyApi.Buddy[]>;
  credentialsSanityCheck: remoteData.RemoteData<
    accountApi.CredentialsSanityCheckOk
  >;
};

const initialState: State = {
  accessToken: remoteData.notAsked,
  mentors: remoteData.notAsked,
  buddies: remoteData.notAsked,
  credentialsSanityCheck: remoteData.notAsked,
};

const {
  actions: mentorActions,
  reducer: mentorReducer,
} = stateHandlers.makeRemoteDataStateHandlers(
  mentorsApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsFailed',
  'fetchMentorsSucceed',
);

const {
  actions: buddyActions,
  reducer: buddyReducer,
} = stateHandlers.makeRemoteDataStateHandlers(
  buddyApi.fetchBuddies,
  'fetchBuddies',
  'fetchBuddiesFail',
  'fetchBuddiesSucceed',
);

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

const {
  actions: loginActions,
  reducer: loginReducer,
} = stateHandlers.makeRemoteDataStateHandlers(
  authApi.login,
  'login',
  'loginFail',
  'loginSucceed',
);
const {
  actions: createUserActions,
  reducer: createUserReducer,
} = stateHandlers.makeRemoteDataStateHandlers(
  accountApi.createUser,
  'createUser',
  'createUserFail',
  'createUserSucceed',
);
const accessTokenReducer = reduxLoop.reduceReducers<
  State['accessToken'],
  Action
>(createUserReducer, loginReducer);

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
export const actions = {
  ...mentorActions,
  ...buddyActions,
  ...loginActions,
  ...createUserActions,
  ...credentialsSanityCheckActions,
};

const reducer = reduxLoop.combineReducers<State, Action>({
  accessToken: accessTokenReducer,
  mentors: mentorReducer,
  buddies: buddyReducer,
  credentialsSanityCheck: credentialsSanityCheckReducer,
});

const createStore = redux.createStore as ((
  reducer: (
    state: State,
    action: Action,
  ) => State | reduxLoop.Loop<State, Action>,
  initialState: State,
  enhancer: redux.StoreEnhancer,
) => redux.Store<State, Action>);

export const store: redux.Store<State, Action> = createStore(
  reducer,
  initialState,
  reduxLoop.install({ DONT_LOG_ERRORS_ON_HANDLED_FAILURES: true }),
);
