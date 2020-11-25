import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';

import * as mentorsApi from '../../api/mentors';

import { cmd } from '../middleware';
import * as actions from '../actions';
import * as types from '../types';

export type State = types.AppState['mentors'];

export const initialState = RD.initial;

const fetchMentors = pipe(
  mentorsApi.fetchMentors(),
  T.map(actions.make('mentors/end')),
);

export const reducer: automaton.Reducer<State, actions.Action> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'mentors/start':
      return automaton.loop(RD.pending, cmd(fetchMentors));
    case 'mentors/end':
      return pipe(action.payload, RD.fromEither);
    default:
      return state;
  }
};

export const get = ({ mentors }: types.AppState) =>
  RD.remoteData.map(mentors, (mentorRecord) => Object.values(mentorRecord));
