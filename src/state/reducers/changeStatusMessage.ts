/* global Response */
import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { AppState } from '../types';
import { withToken } from './accessToken';
import { cmd } from '../middleware';

export const initialState = RD.initial;
export const coolDownDuration = 5000;

export const reducer: automaton.Reducer<
  RD.RemoteData<string, Response>,
  actions.Action
> = (state = initialState, action) => {
  switch (action.type) {
    case 'mentor/changeStatusMessage/start':
      return automaton.loop(
        RD.pending,
        withToken(
          mentorsApi.changeStatusMessage(action.payload),
          actions.make('mentor/changeStatusMessage/completed'),
        ),
      );
    case 'mentor/changeStatusMessage/completed':
      return automaton.loop(
        RD.fromEither(action.payload),
        cmd(
          pipe(
            T.of(undefined),
            T.map(actions.make('mentor/changeStatusMessage/reset')),
            T.delay(coolDownDuration),
          ),
        ),
      );
    case 'mentor/changeStatusMessage/reset':
      if (RD.isPending(state)) {
        return state;
      }

      return RD.initial;
    default:
      return state;
  }
};

export const select = ({ changeStatusMessage: state }: AppState) => state;
