import { Reducer } from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as automaton from 'redux-automaton';
import * as actions from '../actions';

import * as feedbackApi from '../../api/feedback';

import { Action } from '../actions';
import { AppState } from '../types';
import { withToken } from './accessToken';

import { pipe } from 'fp-ts/lib/function';

export const initialState = RD.initial;

export const reducer: Reducer<AppState['feedbackQuestions'], Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'feedback/getQuestions/start': {
      return automaton.loop(
        state,
        withToken(
          feedbackApi.fetchQuestions,
          actions.make('feedback/getQuestions/end'),
        ),
      );
    }

    case 'feedback/getQuestions/end': {
      return pipe(action.payload, RD.fromEither);
    }

    case 'feedback/sendAnswer/start': {
      return automaton.loop(
        state,
        withToken(
          feedbackApi.sendAnswer(action.payload),
          actions.make('feedback/sendAnswer/end'),
        ),
      );
    }

    case 'feedback/sendAnswer/end': {
      return state;
    }

    default: {
      return state;
    }
  }
};

export const selectFirstQuestion = ({ feedbackQuestions }: AppState) =>
  RD.isSuccess(feedbackQuestions) && feedbackQuestions.value.length > 0
    ? feedbackQuestions.value[0]
    : null;
