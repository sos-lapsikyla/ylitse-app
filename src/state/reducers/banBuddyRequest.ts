import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as buddyApi from '../../api/buddies';

import * as actions from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;

type State = AppState['banBuddyRequest'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state: State = initialState,
  action: actions.Action,
) => {
  switch (action.type) {
    case 'buddies/changeBanStatus/start':
      return automaton.loop(
        RD.pending,
        withToken(
          buddyApi.banBuddy(action.payload.buddyId, action.payload.banStatus),
          actions.make('buddies/changeBanStatus/end'),
        ),
      );

    case 'buddies/changeBanStatus/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );
    }

    case 'buddies/changeBanStatusBatch/start':
      return automaton.loop(
        RD.pending,
        withToken(
          buddyApi.banBuddies(
            action.payload.buddyIds,
            action.payload.banStatus,
          ),
          actions.make('buddies/changeBanStatusBatch/end'),
        ),
      );

    case 'buddies/changeBanStatusBatch/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );
    }

    case 'buddies/changeBanStatus/reset': {
      return RD.initial;
    }

    default: {
      return state;
    }
  }
};

export const selectBanBuddyRequest = ({ banBuddyRequest: state }: AppState) =>
  state;

export const selectBanRequestFailed = (state: AppState): boolean => {
  return RD.isFailure(state.banBuddyRequest);
};
