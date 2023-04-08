import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { withToken } from './accessToken';
import { AppState } from '../types';

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type UpdateKey = KeysOfUnion<MentorUpdateData>;
export type MentorUpdateData =
  | {
      is_vacationing: boolean;
    }
  | { status_message: string };
type State = AppState['updateMentorData'];
export const initialState = {
  update: { is_vacationing: RD.initial, status_message: RD.initial },
  current: 'is_vacationing',
} as const;

export const successResetDuration = 3000;
export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/updateMentorData/start': {
      const { key, mentor, account } = action.payload;

      return automaton.loop(
        {
          update: { ...state.update, [key]: RD.pending },
          current: key,
        },
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
              update: { ...state.update, [state.current]: RD.failure(fail) },
            }),
          _ =>
            automaton.loop({
              ...state,
              update: {
                ...state.update,
                [state.current]: RD.success(undefined),
              },
            }),
        ),
      );
    }

    case 'mentor/updateMentorData/reset': {
      return {
        ...state,
        update: { ...state.update, [action.payload]: RD.initial },
      };
    }

    default:
      return state;
  }
};

export const selectMentorDataUpdatingStateFor =
  (key: UpdateKey) =>
  ({ updateMentorData: state }: AppState) => {
    return state.update[key];
  };
