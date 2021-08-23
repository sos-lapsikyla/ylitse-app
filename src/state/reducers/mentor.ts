import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import * as types from '../types';

export type State = types.AppState['mentor'];

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/changeVacationStatus/start':
      return automaton.loop(
        RD.pending,
        withToken(
          mentorsApi.changeVacationStatus(action.payload.mentor),
          actions.make('mentor/changeVacationStatus/end'),
        ),
      );

    case 'mentor/changeVacationStatus/end':
      return pipe(
        action.payload,
        E.fold(
          () => state,
          ({ is_vacationing }) =>
            RD.remoteData.map(state, mentor => ({ ...mentor, is_vacationing })),
        ),
      );

    default:
      return state;
  }
};
