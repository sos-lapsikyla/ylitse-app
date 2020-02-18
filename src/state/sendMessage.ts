import * as reduxLoop from 'redux-loop';

import * as future from '../lib/future';
import * as remoteData from '../lib/remote-data';
import * as retryable from '../lib/remote-data-retryable';
import * as cmd from '../lib/cmd';
import * as http from '../lib/http';

import * as authApi from '../api/auth';
import * as messageApi from '../api/messages';

import * as actions from './actions';
import * as model from './model';

export type Env = {
  accessToken: authApi.AccessToken;
};

export type State = model.AppState['sendMessage'];

export const reducer = (env: Env) => (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'sendMessage':
    case 'sendMessageCompleted':
      const buddyId = action.payload.buddyId;
      const requestState = state[buddyId];
      const [nextRequestState, nextCmd] = reduxLoop.liftState(
        _reducer(env, requestState, action),
      );
      return reduxLoop.loop(
        {
          ...state,
          [buddyId]: nextRequestState,
        },
        nextCmd,
      );
    default:
      return state;
  }
};

export const initialState = {};
type RequestState = retryable.Retryable<undefined, http.Err>;

function _reducer(
  env: Env,
  state: RequestState | undefined = remoteData.notAsked,
  action: actions.Action,
): actions.LS<RequestState> {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        sendMessage: ({ payload: params }) => {
          return reduxLoop.loop(
            remoteData.loading,
            cmd.effect(
              future.lazy(messageApi.sendMessage, env.accessToken, params),
              response =>
                actions.creators.sendMessageCompleted(params.buddyId, response),
            ),
          );
        },
      });
    case 'Loading':
      return matchAction({
        sendMessageCompleted: ({ payload: { response } }) => {
          return response;
        },
      });
    case 'Ok':
      return state;
    default:
      return state;
  }
}
