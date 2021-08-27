import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import { isRight } from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import { AppState } from '../types';

export const initialState = RD.initial;

export const reducer: automaton.Reducer<
  AppState['changeVacationStatus'],
  actions.Action
> = (state = initialState, action) => {
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
      if (isRight(action.payload)) {
        return automaton.loop(
          RD.success(undefined),
          actions.make('mentors/start')(undefined),
        );
      }

      return RD.failure("Can't change vacation status");
    default:
      return state;
  }
};

export const select = ({ changeVacationStatus: state }: AppState) => state;
