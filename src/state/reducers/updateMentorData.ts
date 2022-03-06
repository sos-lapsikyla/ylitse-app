import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import { AppState } from '../types';

type State = AppState['updateMentorData'];
export const initialState = RD.initial;
export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/updateMentorData/start': {
      return automaton.loop(
        RD.pending,
        withToken(
          mentorsApi.updateMentor(
            action.payload.mentor,
            action.payload.account,
          ),
          actions.make('mentor/updateMentorData/end'),
        ),
      );
    }

    case 'mentor/updateMentorData/end': {
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );
    }

    case 'mentor/updateMentorData/reset': {
      return RD.initial;
    }

    default:
      return state;
  }
};

export const selectMentorDataUpdatingState = ({
  updateMentorData: state,
}: AppState) => state;
