import { Reducer } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as automaton from 'redux-automaton';
import * as actions from '../actions';

import * as feedbackApi from '../../api/feedback';

import { Action } from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

export const initialState = RD.initial;

export const reducer: Reducer<AppState['questions'], Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'questions/getQuestions/start': {
      return automaton.loop(
        state,
        withToken(
          feedbackApi.fetchQuestions,
          actions.make('questions/getQuestions/end'),
        ),
      );
    }

    case 'questions/getQuestions/end': {
      console.log('action ended', action.payload);
      return state;
    }
    default: {
      return state;
    }
  }
};
