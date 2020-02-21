import * as reduxLoop from 'redux-loop';

import * as cmd from '../lib/cmd';
import * as result from '../lib/result';
import * as record from '../lib/record';
import * as taggedUnion from '../lib/tagged-union';

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

type State = Partial<{
  [k: string]: Req;
}>;
export const initialState = {};

type Req =
  | {
      request: request.Payload;
      type: 'Loading' | 'Retrying';
    }
  | {
      request: request.Payload;
      type: 'WaitingForAccessToken';
      err: result.Err<any>;
    };
export type LoopState = actions.LS<State>;

const reqKey = (req: request.Payload) => Object.values(req).join('');

export function reducer(
  state: State | undefined = initialState,
  action: actions.Action,
  token: authApi.AccessToken,
): LoopState {
  switch (action.type) {
    case 'requestWithToken': {
      const key = reqKey(action.payload);
      const nextState = {
        ...state,
        [key]: { request: action.payload, type: 'Loading' as const },
      };
      const nextActionCreator = actions.creators.requestCompleted(key);
      const thunk = request.thunk(action.payload, token, env);
      const nextCmd = cmd.effect(thunk, nextActionCreator);

      return reduxLoop.loop(nextState, nextCmd);
    }
    case 'refreshAccessTokenCompleted': {
      if (action.payload.type === 'Ok') {
        const nextState = record.map(state, req =>
          !!req && req.type === 'WaitingForAccessToken'
            ? { ...req, type: 'Retrying' as const }
            : req,
        );
        const newToken = action.payload.value;
        const nextCmds = Object.values(state)
          .filter(
            (x): x is taggedUnion.Pick<Req, 'WaitingForAccessToken'> =>
              !!x && x.type === 'WaitingForAccessToken',
          )
          .map(req => {
            const nextActionCreator = actions.creators.requestCompleted(
              reqKey(req.request),
            );
            const thunk = request.thunk(req.request, newToken, env);
            return cmd.effect(thunk, nextActionCreator);
          });
        return reduxLoop.loop(nextState, reduxLoop.Cmd.list(nextCmds));
      }
      const nextState = record.filter(
        state,
        req => !!req && req.type !== 'WaitingForAccessToken',
      );
      const nextCmds = Object.values(state).reduce(
        (acc: reduxLoop.ActionCmd<any>[], req) => {
          if (!req || req.type !== 'WaitingForAccessToken') return acc;
          const nextAction = request.createAction(req.request, req.err);
          return [...acc, reduxLoop.Cmd.action(nextAction)];
        },
        [],
      );
      return reduxLoop.loop(nextState, reduxLoop.Cmd.list(nextCmds));
    }
    case 'requestCompleted': {
      const { response, key: actionKey } = action.payload;
      const currentRequest = state[actionKey];
      if (currentRequest === undefined) return state;
      if (response.type === 'Err') {
        const { error } = response;
        if (
          error.type === 'BadStatus' &&
          error.status === 401 &&
          currentRequest.type === 'Loading'
        ) {
          return reduxLoop.loop(
            record.map(state, (req, key) =>
              !!req && key === actionKey
                ? {
                    request: req.request,
                    type: 'WaitingForAccessToken' as const,
                    err: response,
                  }
                : req,
            ),
            reduxLoop.Cmd.action(actions.creators.refreshAccessToken()),
          );
        }
      }
      const nextState = record.filter(state, (_, key) => key !== actionKey);
      const nextAction = request.createAction(currentRequest.request, response);
      return reduxLoop.loop(nextState, reduxLoop.Cmd.action(nextAction));
    }
    default:
      return state;
  }
}
