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
        RD.pending,
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
      const nextQuestions = pipe(
        state,
        RD.getOrElse<unknown, feedbackApi.Question[]>(() => []),
        questions => questions.slice(1),
      );

      return automaton.loop(
        RD.success(nextQuestions),
        withToken(
          feedbackApi.sendAnswer(action.payload),
          actions.make('feedback/sendAnswer/end'),
        ),
      );
    }

    case 'feedback/sendAnswer/end': {
      const hasUnAnsweredQuestions = pipe(
        state,
        RD.getOrElse<unknown, feedbackApi.Question[]>(() => []),
        questions => questions.length > 0,
      );

      if (hasUnAnsweredQuestions) {
        return state;
      }

      return automaton.loop(
        state,
        actions.make('feedback/getQuestions/start')(undefined),
      );
    }

    case 'feedback/reset/': {
      return initialState;
    }

    default: {
      return state;
    }
  }
};

export const selectFirstQuestion = ({
  feedbackQuestions,
}: AppState): feedbackApi.Question | null =>
  pipe(
    feedbackQuestions,
    RD.getOrElse<unknown, feedbackApi.Question[]>(() => []),
    questions => (questions.length > 0 ? questions[0] : null),
  );
