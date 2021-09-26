import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;
export const coolDownDuration = 5000;

type State = AppState['changeStatusMessage'];

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentor/changeStatusMessage/start':
      return automaton.loop(
        RD.pending,
        withToken(
          mentorsApi.changeStatusMessage(
            action.payload.mentor,
            action.payload.account,
          ),
          actions.make('mentor/changeStatusMessage/completed'),
        ),
      );

    case 'mentor/changeStatusMessage/completed':
      return pipe(
        action.payload,
        E.fold(
          fail => automaton.loop<State, actions.Action>(RD.failure(fail)),
          _ => automaton.loop(RD.success(undefined)),
        ),
      );

    case 'mentor/changeStatusMessage/reset':
      return RD.initial;

    default:
      return state;
  }
};

export const select = ({ changeStatusMessage: state }: AppState) => state;
