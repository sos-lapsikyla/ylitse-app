import * as automaton from 'redux-automaton';

import * as model from '../model';

import * as storage from './storage';
import * as accessToken from './accessToken';
import * as login from './login';
import * as createUser from './createUser';
import * as buddies from './buddies';
import * as messages from './messages';
import * as sendMessage from './sendMessage';
import * as mentors from './mentors';
import * as markSeen from './markSeen';
import * as userAccount from './userAccount';
import * as changePassword from './changePassword';
import * as changeEmail from './changeEmail';
import * as notifications from './notifications';

import * as actions from '../actions';

export type AppState = model.AppState;

export const rootReducer: automaton.Reducer<
  AppState,
  actions.Action
> = automaton.combineReducers({
  storage: storage.reducer,
  accessToken: accessToken.reducer,
  login: login.reducer,
  createUser: createUser.reducer,
  userAccount: userAccount.reducer,
  changePassword: changePassword.reducer,
  changeEmail: changeEmail.reducer,
  notifications: notifications.reducer,

  mentors: mentors.reducer,
  buddies: buddies.reducer,
  messages: messages.reducer,
  sendMessage: sendMessage.reducer,
  markMessageSeen: markSeen.reducer,
});

export const initialState: AppState = {
  storage: storage.initialState,
  accessToken: accessToken.initialState,
  login: login.initialState,
  createUser: createUser.initialState,
  userAccount: userAccount.initialState,
  changePassword: changePassword.initialState,
  changeEmail: changeEmail.initialState,
  notifications: notifications.initialState,

  mentors: mentors.initialState,
  buddies: buddies.initialState,
  messages: messages.initialState,
  sendMessage: {},
  markMessageSeen: {},
};
