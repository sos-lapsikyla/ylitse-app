import * as redux from 'redux';
import * as reduxLoop from 'redux-loop';

import * as actionsUnion from '../lib/actions-union';
import * as remoteData from '../lib/remote-data';
import * as stateHandlers from '../lib/state-handlers';

import * as mentorsApi from '../api/mentors';

const mentorActions = stateHandlers.makeActionCreators(
  mentorsApi.fetchMentors,
  'fetchMentors',
  'fetchMentorsFailed',
  'fetchMentorsSucceed',
);

export type Action = actionsUnion.ActionsUnion<
  keyof typeof actions,
  typeof actions
>;
export const actions = {
  ...mentorActions,
};

type State = {
  mentors: remoteData.RemoteData<Map<string, mentorsApi.Mentor>>;
};

const initialState: State = { mentors: remoteData.notAsked };

const mentorReducer = stateHandlers.makeReducer(
  mentorsApi.fetchMentors,
  mentorActions,
  'fetchMentors',
  'fetchMentorsFailed',
  'fetchMentorsSucceed',
);

const reducer = reduxLoop.combineReducers<State, Action>({
  mentors: mentorReducer,
});

const createStore = redux.createStore as ((
  reducer: (
    state: State,
    action: Action,
  ) => State | reduxLoop.Loop<State, Action>,
  initialState: State,
  enhancer: redux.StoreEnhancer,
) => redux.Store<State, Action>);

const store: redux.Store<State, Action> = createStore(
  reducer,
  initialState,
  reduxLoop.install({ DONT_LOG_ERRORS_ON_HANDLED_FAILURES: true }),
);

export default store;
