import * as redux from 'redux';
import * as sagaEffects from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import * as remoteData from '../lib/remote-data';
import * as actionsUnion from '../lib/actions-union';
import { makeSaga } from '../lib/remote-data-saga';

import * as mentorsApi from '../api/mentors';
import * as authApi from '../api/auth';
import * as buddyApi from '../api/buddies';

export type State = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
  buddies: remoteData.RemoteData<buddyApi.Buddy[]>;
};
export const initialState = {
  mentors: remoteData.notAsked,
  accessToken: remoteData.notAsked,
  buddies: remoteData.notAsked,
};

const {
  actions: mentorsActions,
  reducer: mentorsReducer,
  saga: mentorsSaga,
} = makeSaga(
  'fetchMentors',
  'fetchMentorsSucceed',
  'fetchMentorsFail',
  mentorsApi.fetchMentors,
);

const {
  actions: loginActions,
  reducer: loginReducer,
  saga: loginSaga,
} = makeSaga('login', 'loginSucceed', 'loginFail', authApi.login);

const {
  actions: buddyActions,
  reducer: buddyReducer,
  saga: buddySaga,
} = makeSaga(
  'fetchBuddies',
  'fetchBuddiesSucceed',
  'fetchBuddiesFail',
  buddyApi.fetchBuddies,
);

// MERGE ACTIONS
export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
export const actions = {
  ...mentorsActions,
  ...loginActions,
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
    accessToken: loginReducer(state.accessToken, action),
    buddies: buddyReducer(state.buddies, action),
  };
}

// MERGE SAGAS
function* rootSaga() {
  yield sagaEffects.all([mentorsSaga(), loginSaga(), buddySaga()]);
}

// INIT REDUX STORE
const sagaMiddleware = createSagaMiddleware();
export const store = redux.createStore(
  rootReducer,
  initialState,
  redux.applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);
