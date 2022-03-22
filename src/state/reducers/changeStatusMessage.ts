/* global Response */
import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';

import * as mentorsApi from '../../api/mentors';

import * as actions from '../actions';

import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;
export const coolDownDuration = 3000;

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
      return RD.fromEither(action.payload);

    case 'mentor/changeStatusMessage/reset':
      return automaton.loop(
        RD.initial,
        actions.make('mentors/start')(undefined),
      );

    default:
      return state;
  }
};

export const select = ({ changeStatusMessage: state }: AppState) => state;
