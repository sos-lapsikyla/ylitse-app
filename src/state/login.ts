import { call, put, takeEvery } from 'redux-saga/effects';

import * as api from '../api/auth';
import * as actionsUnion from '../lib/actions-union';
import * as remoteData from '../lib/remote-data';
import identityObject from '../lib/identity-object';
import { State } from './types';

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;

export const actions = {
  login: (payload: api.Credentials) => ({
    type: 'login' as const,
    payload: payload,
  }),
  loginSuccess: (payload: api.AccessToken) => ({
    type: 'loginSuccess' as const,
    payload,
  }),
  loginFail: (error: Error) => ({
    type: 'loginFail' as const,
    payload: error,
  }),
};
const actionTypes = identityObject(actions);

function* login(action) {
  try {
    const accessToken = yield call(api.login, action.payload);
    yield put(actions.loginSuccess(accessToken));
  } catch (e) {
    yield put(actions.loginFail(e));
  }
}

export function reducer(
  state: remoteData.RemoteData<api.AccessToken>,
  action: Action,
): State['mentors'] {
  switch (action.type) {
    case 'login':
      return remoteData.loading;
    case 'loginSuccess':
      return remoteData.succeed(action.payload);
    case 'loginFail':
      return remoteData.fail(action.payload);
    default:
      return state;
  }
}

export function* saga() {
  yield takeEvery(actionTypes.fetchMentors, fetchMentors);
}
