import { call, put, takeEvery } from 'redux-saga/effects';

import * as api from '../api/mentors';
import * as actionsUnion from '../lib/actions-union';
import * as remoteData from '../lib/remote-data';
import identityObject from '../lib/identity-object';
import { State } from './types';

export type Action = actionsUnion.ActionsUnion<typeof actions>;
export const actions = {
  fetchMentors: () => ({
    type: 'fetchMentors' as const,
    payload: undefined,
  }),
  fetchMentorsSucceed: (mentors: Map<string, api.Mentor>) => ({
    type: 'fetchMentorsSucceed' as const,
    payload: mentors,
  }),
  fetchMentorsFail: (error: Error) => ({
    type: 'fetchMentorsFail' as const,
    payload: error,
  }),
};
const actionTypes = identityObject(actions);

function* fetchMentors() {
  try {
    const mentors = yield call(api.fetchMentors);
    yield put(actions.fetchMentorsSucceed(mentors));
  } catch (e) {
    yield put(actions.fetchMentorsFail(e));
  }
}

export function reducer(
  state: State['mentors'],
  action: Action,
): State['mentors'] {
  switch (action.type) {
    case 'fetchMentors':
      return remoteData.loading;
    case 'fetchMentorsSucceed':
      return remoteData.succeed(action.payload);
    case 'fetchMentorsFail':
      return remoteData.fail(action.payload);
    default:
      return state;
  }
}

export function* saga() {
  yield takeEvery(actionTypes.fetchMentors, fetchMentors);
}
