import * as redux from 'redux';
import createSagaMiddleware from 'redux-saga';

import { all } from 'redux-saga/effects';
import * as mentors from './mentors';

import * as actionsUnion from '../lib/actions-union';
import { State as StateType, initialState } from './types';

export type State = StateType;

export type Action = actionsUnion.ActionsUnion<typeof actions>;
export const actions = {
  ...mentors.actions,
};

function reducer(state: State | undefined, action: Action): State {
  if (state === undefined) {
    return initialState;
  }
  return {
    ...state,
    mentors: mentors.reducer(state.mentors, action),
  };
}

export function* rootSaga() {
  yield all([mentors.saga()]);
}

const sagaMiddleware = createSagaMiddleware();

export const store = redux.createStore(
  reducer,
  initialState,
  redux.applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);
