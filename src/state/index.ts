import * as automaton from 'redux-automaton';
import * as redux from 'redux';

import * as types from './types';
import * as reducers from './reducers';
import * as middleware from './middleware';

export type AppState = types.AppState;

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const enhancer = compose(redux.applyMiddleware(middleware.taskRunner));

export const store = automaton.createStore(
  reducers.rootReducer,
  reducers.initialState,
  enhancer,
);
