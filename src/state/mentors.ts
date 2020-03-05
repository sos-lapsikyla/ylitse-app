import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as R from 'fp-ts-rxjs/lib/Observable';
import { pipe } from 'fp-ts/lib/pipeable';

import * as mentorsApi from '../api/mentors';

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
      return automaton.loop(
        RD.pending,
        actions.creators.fetchCmd(() =>
          R.observable.map(
            mentorsApi.fetchMentors(),
            actions.creators.fetchMentorsCompleted,
          ),
        ),
      );
    case 'fetchMentorsCompleted':
      return pipe(
        action.payload,
        RD.fromEither,
      );
    default:
      return state;
  }
};
