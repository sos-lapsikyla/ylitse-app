import * as automaton from 'redux-automaton';
import * as redux from 'redux';

import * as types from './types';
import * as reducers from './reducers';
import * as middleware from './middleware';

export type AppState = types.AppState;

const middlewares = [middleware.taskRunner];

const enhancer = redux.compose(redux.applyMiddleware(...middlewares));

export const store = automaton.createStore(
  reducers.rootReducer,
  reducers.initialState,
  enhancer,
);
