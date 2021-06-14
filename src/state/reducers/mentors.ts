import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';

import * as localization from '../../localization';

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

export const skillReducer: automaton.Reducer<string[], actions.Action> = (
  state = [],
  action,
) => {
  switch (action.type) {
    case 'skillFilter/toggled':
      return state.includes(action.payload.skillName)
        ? state.filter(skill => skill !== action.payload.skillName)
        : state.concat(action.payload.skillName);
    case 'skillFilter/reset':
      return [];
    default:
      return state;
  }
};

export const getSelectedSkills = (state: types.AppState) => state.skillFilter;

export type ActiveFilters =
  | { kind: 'NoFilters'; message: string }
  | { kind: 'FiltersActive'; message: string };
export function getActiveFilters({
  skillFilter,
}: types.AppState): ActiveFilters {
  const amount = skillFilter.length;

  if (amount === 0) {
    return {
      kind: 'NoFilters',
      message: localization.trans('main.mentorsTitleAndSearchButton'),
    };
  }

  return {
    kind: 'FiltersActive',
    message: `${localization.trans(
      'main.mentorsTitleAndSearchButtonFiltersActive',
    )}: ${amount}`,
  };
}

export const getSkillList = (state: types.AppState) => {
  const remoteDataMentorList = get(state);

  return pipe(
    remoteDataMentorList,
    RD.getOrElse<unknown, mentorsApi.Mentor[]>(() => []),
  )
    .map(mentor => mentor.skills)
    .flat()
    .filter((item, index, self) => self.indexOf(item) === index) // remove duplicates
    .sort();
};

export const get = ({ mentors }: types.AppState) =>
  RD.remoteData.map(mentors, mentorRecord => Object.values(mentorRecord));
