import * as api from '../api/auth';
import * as actionsUnion from '../lib/actions-union';
import { makeSaga } from '../lib/remote-data-saga';

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;

export const { actions, reducer, saga } = makeSaga(
  'login',
  'loginSuccess',
  'loginFail',
  api.login,
);
