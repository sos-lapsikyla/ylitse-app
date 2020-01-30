import * as redux from 'redux';
import * as sagaEffects from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import * as remoteData from '../lib/remote-data';
import * as actionsUnion from '../lib/actions-union';
import { makeRemoteDataStateHandlers } from '../lib/remote-data-saga';

import * as mentorsApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';
import * as accountApi from '../api/account';

export type State = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
  buddies: remoteData.RemoteData<buddyApi.Buddy[]>;
  credentialsSanityCheck: remoteData.RemoteData<
    accountApi.CredentialsSanityCheckOk
  >;
};
export const initialState: State = {
  mentors: remoteData.notAsked,
  accessToken: remoteData.notAsked,
  buddies: remoteData.notAsked,
  credentialsSanityCheck: remoteData.notAsked,
};

const {
  actions: mentorsActions,
  reducer: mentorsReducer,
  saga: mentorsSaga,
} = makeRemoteDataStateHandlers(
  mentorsApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsFail',
  'fetchMentorsSucceed',
);

const {
  actions: credentialsSanityCheckActions,
  reducer: credentialsSanityCheckReducer,
  saga: credentialsSanityCheckSaga,
} = makeRemoteDataStateHandlers(
  accountApi.makeCredentialsSanityCheck,
  'requestCredentialsSanityCheck',
  'credentialsSanityCheckFail',
  'credentialsSanityCheckSucceed',
  'resetCredentialsSanityCheck',
);

const {
  actions: loginActions,
  reducer: loginReducer,
  saga: loginSaga,
} = makeRemoteDataStateHandlers(
  authApi.login,
  'login',
  'loginFail',
  'loginSucceed',
);

const {
  actions: createUserActions,
  reducer: createUserReducer,
  saga: createUserSaga,
} = makeRemoteDataStateHandlers(
  accountApi.createUser,
  'createUser',
  'createUserFail',
  'createUserSucceed',
);

const {
  actions: buddyActions,
  reducer: buddyReducer,
  saga: buddySaga,
} = makeRemoteDataStateHandlers(
  buddyApi.fetchBuddies,
  'fetchBuddies',
  'fetchBuddiesFail',
  'fetchBuddiesSucceed',
);

// MERGE ACTIONS
export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
export const actions = {
  ...mentorsActions,
  ...credentialsSanityCheckActions,
  ...loginActions,
  ...createUserActions,
  ...buddyActions,
};

// MERGE REDUCERS
function rootReducer(state: State | undefined, action: Action): State {
  if (state === undefined) {
    return initialState;
  }
  return {
    ...state,
    mentors: mentorsReducer(state.mentors, action),
    accessToken: createUserReducer(
      loginReducer(state.accessToken, action),
      action,
    ),
    buddies: buddyReducer(state.buddies, action),
    credentialsSanityCheck: credentialsSanityCheckReducer(
      state.credentialsSanityCheck,
      action,
    ),
  };
}

// MERGE SAGAS
function* rootSaga() {
  yield sagaEffects.all([
    mentorsSaga(),
    loginSaga(),
    createUserSaga(),
    buddySaga(),
    credentialsSanityCheckSaga(),
  ]);
}

// INIT REDUX STORE
const sagaMiddleware = createSagaMiddleware();
export const store = redux.createStore(
  rootReducer,
  initialState,
  redux.applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);
