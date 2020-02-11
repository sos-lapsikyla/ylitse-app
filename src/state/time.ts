import * as reduxLoop from 'redux-loop';
import * as actions from './actions';

import * as timestamped from '../lib/timestamped';

export type State = { ticking: boolean; time: number };
export const initialState = { ticking: false, time: Date.now() };

export const reducer: actions.Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'startTicking':
      if (state.ticking) {
        return state;
      }
      return reduxLoop.loop(
        { ...state, ticking: true },
        reduxLoop.Cmd.run(timestamped.tick, {
          successActionCreator: actions.creators.tick,
        }),
      );
    case 'tick':
      if (!state.ticking) {
        return state;
      }
      return reduxLoop.loop(
        { ...state, time: action.payload.timestamp },
        reduxLoop.Cmd.run(timestamped.tick, {
          successActionCreator: actions.creators.tick,
        }),
      );

    default:
      return state;
  }
};
