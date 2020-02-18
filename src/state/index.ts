import * as reduxLoop from 'redux-loop';
import * as redux from 'redux';

import * as taggedUnion from '../lib/tagged-union';

import * as actions from './actions';
import * as accessToken from './accessToken';
import * as buddies from './buddies';
import * as messages from './messages';
import * as mentors from './mentors';
import * as scheduler from './scheduler';
import * as model from './model';

export type AppState = model.AppState;

export const initialState: AppState = {
  accessToken: accessToken.initialState,
  mentors: mentors.initialState,
  buddies: buddies.initialState,
  messages: messages.initialState,
  scheduler: scheduler.initialState,
  sendMessage: {},
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
        buddies.reducer(token)(state.buddies, action),
      None: state.buddies,
    }),
  );
  const [messagesModel, messagesCmd] = reduxLoop.liftState(
    taggedUnion.match<accessToken.State, messages.LoopState>(
      state.accessToken,
      {
        Some: ({ value: [token] }) =>
          messages.reducer({ accessToken: token })(state.messages, action),
        None: state.messages,
      },
    ),
  );
  const [schedulerModel, schedulerCmd] = reduxLoop.liftState(
    scheduler.reducer(state.scheduler, action),
  );
  return reduxLoop.loop(
    {
      scheduler: schedulerModel,

      accessToken: tokenModel,
      mentors: mentorsModel,
      buddies: buddiesModel,
      messages: messagesModel,
      sendMessage: {},
    },
    reduxLoop.Cmd.list([
      tokenCmd,
      mentorsCmd,
      buddiesCmd,
      messagesCmd,
      schedulerCmd,
    ]),
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
