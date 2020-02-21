import * as reduxLoop from 'redux-loop';

import * as remoteData from '../lib/remote-data';
import * as http from '../lib/http';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['sendMessage'];
export const reducer = (state: State, action: actions.Action) => {
  switch (action.type) {
    case 'sendMessage':
    case 'sendMessageCompleted':
      const buddyId = action.payload.buddyId;
      const requestState = state[buddyId];
      const [nextRequestState, nextCmd] = reduxLoop.liftState(
        _reducer(requestState, action),
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
type RequestState = remoteData.RemoteData<undefined, http.Err>;

function _reducer(
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
            reduxLoop.Cmd.action(
              actions.creators.requestWithToken({
                func: 'sendMessage' as const,
                funcArgs: [params],
                actionCreator: 'sendMessageCompleted' as const,
                actionCreatorArgs: [params.buddyId],
              }),
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
