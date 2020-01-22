import * as api from '../api/mentors';
import * as actionsUnion from '../lib/actions-union';
import { makeSaga } from '../lib/remote-data-saga';

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;

export const { actions, reducer, saga } = makeSaga(
  'fetchMentors',
  'fetchMentorsSucceed',
  'fetchMentorsFail',
  api.fetchMentors,
);
