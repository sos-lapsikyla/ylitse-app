import * as reduxLoop from 'redux-loop';

import * as stateHandlers from '../lib/state-handlers';
import * as actionsUnion from '../lib/actions-union';

import * as accountApi from '../api/account';
import * as authApi from '../api/auth';

import { State } from './state';

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

export type Action =
  | actionsUnion.ActionsUnion<keyof typeof actions, typeof actions>
  | stateHandlers.UnknownAction;
export const actions = {
  ...loginActions,
  ...createUserActions,
};

export const reducer = reduxLoop.reduceReducers<State['accessToken'], Action>(
  createUserReducer,
  loginReducer,
);
