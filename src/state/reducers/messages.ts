import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';

import * as messageApi from '../../api/messages';

import * as actions from '../actions';
import * as model from '../model';

import { withToken } from './accessToken';

export type State = model.AppState['messages'];
export type LoopState = actions.LS<State>;

export const initialState = {
  polling: false,
  messages: RD.initial,
};

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'token/Acquired':
      return !RD.isInitial(state.messages)
        ? state
        : automaton.loop(
            { polling: true, messages: RD.pending },
            withToken(
              messageApi.fetchMessages,
              actions.make('messages/get/completed'),
            ),
          );
    case 'messages/get/completed':
      if (!state.polling) {
        return state;
      }
      const nextState = {
        ...state,
        messages: RD.remoteData.alt(
          RD.fromEither(action.payload),
          () => state.messages,
        ),
      };

      const nextCmd = withToken(
        flow(
          messageApi.fetchMessages,
          T.delay(1000),
        ),
        actions.make('messages/get/completed'),
      );

      return automaton.loop(nextState, nextCmd);
    default:
      return state;
  }
};
