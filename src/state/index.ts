import * as automaton from 'redux-automaton';
import * as redux from 'redux';

import * as types from './types';
import * as reducers from './reducers';
import * as middleware from './middleware';
import createDebugger from 'redux-flipper';

export type AppState = types.AppState;

const middlewares = [middleware.taskRunner];

if (__DEV__) {
  middlewares.push(createDebugger());
}

const enhancer = redux.compose(redux.applyMiddleware(...middlewares));

export const store = automaton.createStore(
  reducers.rootReducer,
  reducers.initialState,
  enhancer,
);
