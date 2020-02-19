import * as reduxLoop from 'redux-loop';

import * as future from '../lib/future';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['scheduler'];
export const initialState: State = {};

export function reducer(state: State = initialState, action: actions.Action) {
  const matchAction = actions.match(state, action);
  return matchAction({
    startPolling({ payload: { action: pollAction, delay } }) {
      if (pollAction.type in state) {
        return state;
      }
      return reduxLoop.loop(
        {
          ...state,
          [pollAction.type]: { action: pollAction, delay, isLooping: false },
        },
        reduxLoop.Cmd.action(actions.creators.poll(pollAction.type)),
      );
    },
    poll({ payload: actionName }) {
      const actionState = state[actionName];
      if (!actionState) return state;
      if (actionState.isLooping) return state;
      return reduxLoop.loop(
        {
          ...state,
          [actionName]: { ...actionState, isLooping: true },
        },
        reduxLoop.Cmd.list([
          reduxLoop.Cmd.action(actionState.action),
          reduxLoop.Cmd.run(future.sleep(actionState.delay), {
            successActionCreator: () =>
              actions.creators.pollComplete(actionName),
          }),
        ]),
      );
    },
    pollComplete({ payload: actionName }) {
      const actionState = state[actionName];
      if (!actionState) return state;
      if (!actionState.isLooping) return state;
      return reduxLoop.loop(
        {
          ...state,
          [actionName]: { ...actionState, isLooping: false },
        },
        reduxLoop.Cmd.action(actions.creators.poll(actionName)),
      );
    },
  });
}
