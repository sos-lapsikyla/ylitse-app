import * as reduxLoop from 'redux-loop';
import * as redux from 'redux';
import * as option from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

import * as actions from './actions';
import * as accessToken from './accessToken';
import * as buddies from './buddies';
import * as messages from './messages';
import * as sendMessage from './sendMessage';
import * as mentors from './mentors';
import * as scheduler from './scheduler';
import * as request from './request';
import * as model from './model';

export type AppState = model.AppState;

export const initialState: AppState = {
  accessToken: accessToken.initialState,
  mentors: mentors.initialState,
  buddies: buddies.initialState,
  messages: messages.initialState,
  scheduler: scheduler.initialState,
  request: request.initialState,
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
    buddies.reducer(state.buddies, action),
  );
  const [messagesModel, messagesCmd] = reduxLoop.liftState(
    messages.reducer(state.messages, action),
  );
  const [sendMessageModel, sendMessageCmd] = reduxLoop.liftState(
    sendMessage.reducer(state.sendMessage, action),
  );
  const [schedulerModel, schedulerCmd] = reduxLoop.liftState(
    scheduler.reducer(state.scheduler, action),
  );

  const [requestModel, requestCmd] = pipe(
    state.accessToken,
    option.fold(
      () => state.request,
      ([token]) => request.reducer(state.request, action, token),
    ),
    reduxLoop.liftState,
  );
  return reduxLoop.loop(
    {
      scheduler: schedulerModel,

      accessToken: tokenModel,
      mentors: mentorsModel,
      buddies: buddiesModel,
      messages: messagesModel,
      sendMessage: sendMessageModel,
      request: requestModel,
    },
    reduxLoop.Cmd.list([
      tokenCmd,
      mentorsCmd,
      buddiesCmd,
      messagesCmd,
      sendMessageCmd,
      schedulerCmd,
      requestCmd,
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
