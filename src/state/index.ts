import * as automaton from 'redux-automaton';
import * as reduxObservable from 'redux-observable';
import * as redux from 'redux';

import * as model from './model';
import * as actions from './actions';
import * as reducers from './reducers';

import rootEpic from './epics';

export type AppState = model.AppState;

const epicMiddleware = reduxObservable.createEpicMiddleware<
  actions.Action,
  actions.Action,
  AppState
>();
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const enhancer = compose(redux.applyMiddleware(epicMiddleware));

export const store = automaton.createStore(
  reducers.rootReducer,
  reducers.initialState,
  enhancer,
);
epicMiddleware.run(rootEpic);
