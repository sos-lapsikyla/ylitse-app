import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import { AppState } from '../types';

export const initialState = RD.initial;

type State = AppState['changeVacationStatus'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/changeVacationStatus/start':
      return automaton.loop(
        RD.pending,
        withToken(
          mentorsApi.changeVacationStatus(
            {
              ...action.payload.mentor,
              is_vacationing: !action.payload.mentor.is_vacationing,
            },
            action.payload.account,
          ),
          actions.make('mentor/changeVacationStatus/end'),
        ),
      );

    case 'mentor/changeVacationStatus/end':
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );

    default:
      return state;
  }
};

export const select = ({ changeVacationStatus: state }: AppState) => state;
