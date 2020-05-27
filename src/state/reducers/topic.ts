import * as T from 'fp-ts/lib/Task';
import * as record from 'fp-ts/lib/Record';
import * as automaton from 'redux-automaton';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';

import * as topicApi from '../../api/topic-storage';

import * as actions from '../actions';
import { AppState } from '../types';
import { cmd } from '../middleware';

export type State = AppState['topic'];

export const initialState: State = O.none;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'topic/read/start': {
      const nextCmd = pipe(
        topicApi.readTopic,
        T.map(
          flow(
            O.fromEither,
            actions.make('topic/read/end'),
          ),
        ),
        cmd,
      );
      return automaton.loop(state, nextCmd);
    }
    case 'topic/read/end': {
      return action.payload;
    }
    case 'topic/write': {
      const nextCmd = actions.make('topic/write')(action.payload);
      return automaton.loop(action.payload, nextCmd);
    }
    default: {
      return state;
    }
  }
};
