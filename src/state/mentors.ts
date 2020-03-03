import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as actions from './actions';
import * as model from './model';

export type State = model.AppState['mentors'];

export const initialState = RD.initial;

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'fetchMentors':
      return automaton.loop(RD.pending, {
        type: 'FetchCmd',
        f: 'fetchMentors',
        args: () => [],
        onComplete: actions.creators.fetchMentorsCompleted,
      });
    case 'fetchMentorsCompleted':
      return pipe(
        action.payload,
        RD.fromEither,
      );
    default:
      return state;
  }
};
