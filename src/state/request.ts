import * as reduxLoop from 'redux-loop';

import * as cmd from '../lib/cmd';

import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';
import * as buddyApi from '../api/buddies';

import * as actions from './actions';
import * as request from './actions/request';
import { Env } from './env';

export const env: Env = {
  sendMessage: (token: authApi.AccessToken) => async (
    params: messageApi.SendMessageParams,
  ) => messageApi.sendMessage(token, params),
  fetchBuddies: (token: authApi.AccessToken) => async () =>
    buddyApi.fetchBuddies(token),
};

type State = {
  args: request.Payload;
  phase: 'loading' | 'WaitingForAccessToken' | 'Retrying';
}[];

export function reducer(
  state: State,
  action: actions.Action,
  token: authApi.AccessToken,
) {
  switch (action.type) {
    case 'requestWithToken': {
      const nextState = [...state, { args: action.payload, phase: 'loading' }];
      const index = nextState.length - 1;

      const nextActionCreator = actions.creators.requestCompleted(index);
      const thunk = request.thunk(action.payload[0], token, env);
      const nextCmd = cmd.effect(thunk, nextActionCreator);

      return reduxLoop.loop(nextState, nextCmd);
    }
    case 'refreshAccessTokenCompleted': {
      if (action.payload.type === 'Ok') {
        const nextState = state.map(req =>
          req.phase === 'WaitingForAccessToken'
            ? { ...req, phase: 'Retrying' as const }
            : req,
        );
        const newToken = action.payload.value;
        const nextCmds = state
          .filter(req => req.phase === 'WaitingForAccessToken')
          .map((req, index) => {
            const nextActionCreator = actions.creators.requestCompleted(index);
            const thunk = request.thunk(req.args[0], newToken, env);
            return cmd.effect(thunk, nextActionCreator);
          });
        return reduxLoop.loop(nextState, reduxLoop.Cmd.list(nextCmds));
      }
      return state;
    }
    case 'requestCompleted': {
      const { response, index: actionIndex } = action.payload;
      const currentRequest = state[actionIndex];
      if (response.type === 'Err') {
        const { error } = response;
        if (
          error.type === 'BadStatus' &&
          error.status === 401 &&
          currentRequest.phase === 'loading'
        ) {
          return reduxLoop.loop(
            state.map((req, index) =>
              index === actionIndex
                ? {
                    ...req,
                    phase: 'WaitingForAccessToken' as const,
                  }
                : req,
            ),
            reduxLoop.Cmd.action(actions.creators.refreshAccessToken()),
          );
        }
      }
      const nextState = state.filter((_, index) => index !== actionIndex);
      const nextAction = request.createAction(currentRequest.args, response);
      return reduxLoop.loop(nextState, reduxLoop.Cmd.action(nextAction));
    }
    default:
      return state;
  }
}
