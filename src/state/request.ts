import * as reduxLoop from 'redux-loop';

import * as cmd from '../lib/cmd';
import * as result from '../lib/result';
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

type State = (
  | {
      request: request.Payload;
      phase: 'Loading' | 'Retrying';
    }
  | {
      request: request.Payload;
      phase: 'WaitingForAccessToken';
      err: result.Err<any>;
    })[];

export function reducer(
  state: State,
  action: actions.Action,
  token: authApi.AccessToken,
) {
  switch (action.type) {
    case 'requestWithToken': {
      const nextState = [
        ...state,
        { request: action.payload, phase: 'Loading' },
      ];
      const index = nextState.length - 1;

      const nextActionCreator = actions.creators.requestCompleted(index);
      const thunk = request.thunk(action.payload, token, env);
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
            const thunk = request.thunk(req.request, newToken, env);
            return cmd.effect(thunk, nextActionCreator);
          });
        return reduxLoop.loop(nextState, reduxLoop.Cmd.list(nextCmds));
      }
      const nextState = state.filter(
        req => req.phase !== 'WaitingForAccessToken',
      );
      const nextCmds = state.reduce((acc: reduxLoop.ActionCmd<any>[], req) => {
        if (req.phase !== 'WaitingForAccessToken') return acc;
        const nextAction = request.createAction(req.request, req.err);
        return [...acc, reduxLoop.Cmd.action(nextAction)];
      }, []);
      return reduxLoop.loop(nextState, reduxLoop.Cmd.list(nextCmds));
    }
    case 'requestCompleted': {
      const { response, index: actionIndex } = action.payload;
      const currentRequest = state[actionIndex];
      if (response.type === 'Err') {
        const { error } = response;
        if (
          error.type === 'BadStatus' &&
          error.status === 401 &&
          currentRequest.phase === 'Loading'
        ) {
          return reduxLoop.loop(
            state.map((req, index) =>
              index === actionIndex
                ? {
                    request: req.request,
                    phase: 'WaitingForAccessToken' as const,
                    err: response,
                  }
                : req,
            ),
            reduxLoop.Cmd.action(actions.creators.refreshAccessToken()),
          );
        }
      }
      const nextState = state.filter((_, index) => index !== actionIndex);
      const nextAction = request.createAction(currentRequest.request, response);
      return reduxLoop.loop(nextState, reduxLoop.Cmd.action(nextAction));
    }
    default:
      return state;
  }
}
