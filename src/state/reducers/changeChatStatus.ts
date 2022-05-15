import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as buddyApi from '../../api/buddies';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;

type State = AppState['changeChatStatusRequest'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'buddies/changeChatStatus/start':
      return automaton.loop(
        RD.pending,
        withToken(
          buddyApi.changeChatStatus(
            action.payload.buddyId,
            action.payload.chatStatus,
          ),
          actions.make('buddies/changeChatStatus/end'),
        ),
      );

    case 'buddies/changeChatStatus/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );
    }

    case 'buddies/changeChatStatusBatch/start':
      return automaton.loop(
        RD.pending,
        withToken(
          buddyApi.changeChatStatusMultiple(
            action.payload.buddyIds,
            action.payload.chatStatus,
          ),
          actions.make('buddies/changeChatStatusBatch/end'),
        ),
      );

    case 'buddies/changeChatStatusBatch/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );
    }

    case 'buddies/changeChatStatus/reset': {
      return RD.initial;
    }

    default: {
      return state;
    }
  }
};

export const selectBanBuddyRequest = ({
  changeChatStatusRequest: state,
}: AppState) => state;

export const selectBanRequestFailed = (state: AppState): boolean => {
  return RD.isFailure(state.changeChatStatusRequest);
};
