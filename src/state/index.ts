import * as reduxLoop from 'redux-loop';
import * as redux from 'redux';

import * as taggedUnion from '../lib/tagged-union';

import * as actions from './actions';
import * as accessToken from './accessToken';
import * as buddies from './buddies';
import * as mentors from './mentors';
import * as selectors from './selectors';

export type AppState = selectors.AppState;

export const initialState: AppState = {
  accessToken: accessToken.initialState,
  mentors: mentors.initialState,
  buddies: buddies.initialState,
};

function reducer(state: AppState = initialState, action: actions.Action) {
  const [tokenModel, tokenCmd] = reduxLoop.liftState(
    accessToken.reducer(state.accessToken, action),
  );
  const [mentorsModel, mentorsCmd] = reduxLoop.liftState(
    mentors.reducer(state.mentors, action),
  );
  const [buddiesModel, buddiesCmd] = reduxLoop.liftState(
    taggedUnion.match<accessToken.State, buddies.LoopState>(state.accessToken, {
      Some: ({ value: [token] }) =>
        buddies.reducer(token, state.buddies, action),
      None: state.buddies,
    }),
  );
  return reduxLoop.loop(
    {
      accessToken: tokenModel,
      mentors: mentorsModel,
      buddies: buddiesModel,
    },
    reduxLoop.Cmd.list([tokenCmd, mentorsCmd, buddiesCmd]),
  );
}

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
