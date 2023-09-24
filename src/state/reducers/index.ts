import * as automaton from 'redux-automaton';
import * as T from 'fp-ts/lib/Task';

import * as tokenStorage from '../../api/token-storage';
import { cmd } from '../middleware';

import * as types from '../types';

import * as storage from './storage';
import * as accessToken from './accessToken';
import * as login from './login';
import * as createUser from './createUser';
import * as buddies from './buddies';
import * as changeChatStatusRequest from './changeChatStatus';
import * as messages from './messages';
import * as newMessage from './newMessage';
import * as mentors from './mentors';
import * as markSeen from './markSeen';
import * as userAccount from './userAccount';
import * as changePassword from './changePassword';
import * as changeEmail from './changeEmail';
import * as notifications from './notifications';
import * as deleteAccount from './deleteAccount';
import * as statRequest from './statRequest';
import * as userReport from './userReport';
import * as updateMentorData from './updateMentorData';
import * as questions from './questions';
import * as filterMentors from './filterMentors';

import * as actions from '../actions';

export type AppState = types.AppState;

const exitReducer: automaton.Reducer<AppState, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'logout/logout': {
      return automaton.loop(
        initialState,
        cmd(T.task.map(tokenStorage.purgeToken, _ => actions.none)),
      );
    }
    default: {
      return state;
    }
  }
};

export const rootReducer: automaton.Reducer<AppState, actions.Action> =
  automaton.reducerReducers(
    exitReducer,
    automaton.combineReducers({
      storage: storage.reducer,
      accessToken: accessToken.reducer,
      login: login.reducer,
      createUser: createUser.reducer,
      userAccount: userAccount.reducer,
      changePassword: changePassword.reducer,
      changeEmail: changeEmail.reducer,
      updateMentorData: updateMentorData.reducer,
      notifications: notifications.reducer,
      deleteAccount: deleteAccount.reducer,
      mentors: mentors.reducer,
      statRequest: statRequest.reducer,
      userReport: userReport.reducer,
      buddies: buddies.reducer,
      changeChatStatusRequest: changeChatStatusRequest.reducer,
      messages: messages.reducer,
      newMessage: newMessage.reducer,
      markMessageSeen: markSeen.reducer,
      feedbackQuestions: questions.reducer,
      filterMentors: filterMentors.filterMentorsReducer,
    }),
  );

export const initialState: AppState = {
  storage: storage.initialState,
  accessToken: accessToken.initialState,
  login: login.initialState,
  createUser: createUser.initialState,
  userAccount: userAccount.initialState,
  changePassword: changePassword.initialState,
  changeEmail: changeEmail.initialState,
  updateMentorData: updateMentorData.initialState,
  notifications: notifications.initialState,
  deleteAccount: deleteAccount.initialState,
  mentors: mentors.initialState,
  statRequest: statRequest.initialState,
  userReport: userReport.initialState,
  buddies: buddies.initialState,
  changeChatStatusRequest: changeChatStatusRequest.initialState,
  messages: messages.initialState,
  newMessage: {},
  markMessageSeen: {},
  feedbackQuestions: questions.initialState,
  filterMentors: filterMentors.initialState,
};
