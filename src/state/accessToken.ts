import * as reduxLoop from 'redux-loop';

import assertNever from '../lib/assert-never';
import * as taggedUnion from '../lib/tagged-union';
import * as option from '../lib/option';
import * as remoteData from '../lib/remote-data';
import * as http from '../lib/http';
import * as tuple from '../lib/tuple';
import * as f from '../lib/future';

import * as authApi from '../api/auth';

import * as actions from './actions';

type NextToken = Exclude<
  remoteData.RemoteData<authApi.AccessToken, http.Err>,
  remoteData.Ok<unknown>
>;
type TokenState = [authApi.AccessToken, NextToken];
export type State = option.Option<TokenState>;
export const initialState = option.none;

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  const matchAction = actions.match(state, action);
  return taggedUnion.match(state, {
    None: matchAction({
      login: ({ payload }) => option.some([payload, remoteData.notAsked]),
    }),
    Some: ({ value: [currentToken, nextToken] }) => {
      const [model, cmd] = reduxLoop.liftState(
        tokenReducer(currentToken, nextToken, action),
      );
      const nextState =
        model.type === 'Ok'
          ? tuple.tuple(model.value, remoteData.notAsked)
          : tuple.tuple(currentToken, model);
      return reduxLoop.loop(option.some(nextState), cmd);
    },
  });
};

function tokenReducer(
  currentToken: authApi.AccessToken,
  state: remoteData.RemoteData<authApi.AccessToken, http.Err>,
  action: actions.Action,
): actions.LS<remoteData.RemoteData<authApi.AccessToken, http.Err>> {
  const matchAction = actions.match(state, action);
  switch (state.type) {
    case 'NotAsked':
    case 'Err':
      return matchAction({
        refreshAccessToken: reduxLoop.loop(
          remoteData.loading,
          reduxLoop.Cmd.run(f.lazy(authApi.refreshAccessToken, currentToken), {
            successActionCreator: actions.creators.refreshAccessTokenCompleted,
          }),
        ),
      });
    case 'Loading':
      return matchAction({
        refreshAccessTokenCompleted: ({ payload }) => payload,
      });
    case 'Ok':
      return state;
    default:
      return assertNever(state);
  }
}
