import * as sagaEffects from 'redux-saga/effects';

import * as remoteData from '../lib/remote-data';
import * as actionsUnion from '../lib/actions-union';
import { makeSaga } from '../lib/remote-data-saga';

import * as mentorsApi from '../api/mentors';
import * as authApi from '../api/auth';

type State = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
  accessToken: remoteData.RemoteData<authApi.AccessToken>;
};
export const initialState = {
  mentors: remoteData.notAsked,
  accessToken: remoteData.notAsked,
};

export const {
  actions: mentorsActions,
  reducer: mentorsReducer,
  saga: mentorsSaga,
} = makeSaga(
  'fetchMentors',
  'fetchMentorsSucceed',
  'fetchMentorsFail',
  mentorsApi.fetchMentors,
);

export const {
  actions: loginActions,
  reducer: loginReducer,
  saga: loginSaga,
} = makeSaga('login', 'loginSucceed', 'loginFail', authApi.login);

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
const actions = {
  ...mentorsActions,
  ...loginActions,
};

export function rootReducer(state: State | undefined, action: Action): State {
  if (state === undefined) {
    return initialState;
  }
  return {
    ...state,
    mentors: mentorsReducer(state.mentors, action),
    accessToken: loginReducer(state.accessToken, action),
  };
}

export function* rootSaga() {
  yield sagaEffects.all([mentorsSaga(), loginSaga()]);
}
