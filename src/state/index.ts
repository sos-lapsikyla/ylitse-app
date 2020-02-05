import * as reduxLoop from 'redux-loop';
import * as redux from 'redux';

import * as actions from './actions';

import * as accessToken from './accessToken';
import * as buddies from './buddies';
import * as mentors from './mentors';
import * as time from './time';

export type AppState = time.State &
  accessToken.State &
  mentors.State &
  buddies.State;

export const initialState: AppState = {
  time: time.initialState,
  accessToken: accessToken.initialState,
  mentors: mentors.initialState,
  buddies: buddies.initialState,
};

export const reducer: actions.Reducer<AppState> = reduxLoop.combineReducers<
  AppState,
  actions.Action
>({
  time: time.reducer,
  accessToken: accessToken.reducer,
  mentors: mentors.reducer,
  buddies: buddies.reducer,
});

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const enhancer = compose(
  reduxLoop.install({ DONT_LOG_ERRORS_ON_HANDLED_FAILURES: true }),
);

const createStore = redux.createStore as ((
  reducer: actions.Reducer<AppState>,
  initialState: AppState,
  enhancer: redux.StoreEnhancer,
) => redux.Store<AppState, actions.Action>);

export const store = createStore(reducer, initialState, enhancer);
store.dispatch(actions.creators.startTicking());
