import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import { AppState } from '../types';

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type UpdateKey = KeysOfUnion<MentorUpdateData> | null;
export type MentorUpdateData =
  | {
      is_vacationing: boolean;
    }
  | { status_message: string };
type State = AppState['updateMentorData'];
export const initialState = { update: RD.initial, key: null };
export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/updateMentorData/start': {
      const { key, mentor, account } = action.payload;

      return automaton.loop(
        { key, update: RD.pending },
        withToken(
          mentorsApi.updateMentor(mentor, account),
          actions.make('mentor/updateMentorData/end'),
        ),
      );
    }

    case 'mentor/updateMentorData/end': {
      return pipe(
        action.payload,
        E.fold(
          fail =>
            automaton.loop<State, actions.Action>({
              ...state,
              update: RD.failure(fail),
            }),
          _ => automaton.loop({ ...state, update: RD.success(undefined) }),
        ),
      );
    }

    case 'mentor/updateMentorData/reset': {
      return initialState;
    }

    default:
      return state;
  }
};

export const selectMentorDataUpdatingState = ({
  updateMentorData: state,
}: AppState) => ({ isLoading: RD.isPending(state.update), key: state.key });
