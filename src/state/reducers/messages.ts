import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import * as messageApi from '../../api/messages';

import * as actions from '../actions';
import * as model from '../model';

import { withToken } from './accessToken';

export type State = model.AppState['messages'];
export type LoopState = actions.LS<State>;

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'token/Acquired':
      return !RD.isInitial(state)
        ? state
        : automaton.loop(
            RD.pending,
            withToken(
              messageApi.fetchMessages,
              actions.make('messages/get/completed'),
            ),
          );
    case 'messages/get/completed':
      return RD.fromEither(action.payload);
    default:
      return state;
  }
};
