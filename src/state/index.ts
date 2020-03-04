import * as automaton from 'redux-automaton';
import * as reduxObservable from 'redux-observable';
import * as redux from 'redux';

import * as actions from './actions';
import * as accessToken from './accessToken';
import * as login from './login';
import * as createUser from './createUser';
import * as buddies from './buddies';
import * as messages from './messages';
import * as sendMessage from './sendMessage';
import * as mentors from './mentors';
import * as model from './model';

import rootEpic from './epics';
import { deps, Deps } from './deps';

export type AppState = model.AppState;

export const initialState: AppState = {
  accessToken: accessToken.initialState,
  login: login.initialState,
  createUser: createUser.initialState,
  mentors: mentors.initialState,
  buddies: buddies.initialState,
  messages: messages.initialState,
  sendMessage: {},
};

const reducer = automaton.combineReducers({
  accessToken: accessToken.reducer,
  login: login.reducer,
  createUser: createUser.reducer,
  mentors: mentors.reducer,
  buddies: buddies.reducer,
  messages: messages.reducer,
  sendMessage: sendMessage.reducer,
});

const epicMiddleware = reduxObservable.createEpicMiddleware<
  actions.Action,
  actions.Action,
  AppState,
  Deps
>({
  dependencies: deps,
});
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const enhancer = compose(redux.applyMiddleware(epicMiddleware));

export const store = automaton.createStore(
  reducer as any,
  initialState,
  enhancer,
);
epicMiddleware.run(rootEpic);
