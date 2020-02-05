import * as reduxLoop from 'redux-loop';

import * as remoteData from '../lib/remote-data';
import * as http from '../lib/http';
import * as reduxHelpers from '../lib/redux-helpers';

import * as accountApi from '../api/account';
import * as authApi from '../api/auth';

import * as actions from './actions';

export type AccessToken = remoteData.RemoteData<authApi.AccessToken, http.Err>;
export type State = { accessToken: AccessToken };
export const initialState = remoteData.notAsked;

const createUser = reduxHelpers.makeReducer(
  accountApi.createUser,
  actions.createUser,
  'createUser',
  'createUserCompleted',
  'createUserReset',
);

const login = reduxHelpers.makeReducer(
  authApi.login,
  actions.login,
  'login',
  'loginCompleted',
  'loginReset',
);

const refreshAccessToken: actions.Reducer<AccessToken> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'refreshAccessToken':
      return remoteData.chain(state, accessToken => {
        if (accessToken.isRefreshing) {
          return state;
        }
        return reduxLoop.loop(
          remoteData.ok({ ...accessToken, isRefreshing: true }),
          reduxLoop.Cmd.run(authApi.refreshAccessToken, {
            args: [accessToken],
            successActionCreator: actions.creators.refreshAccessTokenCompleted,
          }),
        );
      });
    case 'refreshAccessTokenCompleted':
      return remoteData.map(
        remoteData.append(state, action.payload),
        ([_, token]) => ({
          ...token,
          isRefreshing: false,
        }),
      );
    default:
      return state;
  }
};

export const reducer = reduxLoop.reduceReducers<AccessToken, actions.Action>(
  createUser,
  login,
  refreshAccessToken,
);

export const get = ({ accessToken }: State) => accessToken;
