import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';

import * as mentorsApi from '../../api/mentors';

import { cmd } from '../actions/epic';
import * as actions from '../actions';
import * as model from '../model';

export type State = model.AppState['mentors'];

export const initialState = RD.initial;

const fetchMentors = flow(
  mentorsApi.fetchMentors,
  R.map(actions.make('mentors/end')),
);

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentors/start':
      return automaton.loop(RD.pending, cmd(fetchMentors));
    case 'mentors/end':
      return pipe(
        action.payload,
        RD.fromEither,
      );
    default:
      return state;
  }
};
