import * as automaton from 'redux-automaton';
import * as RD from '@devexperts/remote-data-ts';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';

import { pipe, flow } from 'fp-ts/lib/function';

import * as localization from '../../localization';

import * as mentorsApi from '../../api/mentors';

import { cmd } from '../middleware';
import * as actions from '../actions';
import * as types from '../types';
import { getAccount } from '../selectors';

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
    case 'mentors/start': {
      return automaton.loop(RD.pending, cmd(fetchMentors));
    }

    case 'mentors/end': {
      return pipe(action.payload, RD.fromEither);
    }

    case 'mentor/updateMentorData/end': {
      return pipe(
        action.payload,
        E.fold(
          () => state,
          mentor =>
            pipe(
              state,
              RD.map(mentors => ({
                ...mentors,
                [mentor.buddyId]: mentor,
              })),
            ),
        ),
      );
    }

    default:
      return state;
  }
};

export const getSelectedSkills = (state: types.AppState) =>
  state.filterMentors.skillFilter;

export type ActiveFilters =
  | { kind: 'NoFilters'; message: string }
  | { kind: 'FiltersActive'; message: string };
export function getActiveFilters({
  filterMentors,
}: types.AppState): ActiveFilters {
  const amount = filterMentors.skillFilter.length;

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

export const getMentorByUserId = (userId: string) =>
  flow(
    ({ mentors }: types.AppState) => mentors,
    RD.map(mentors =>
      Object.values(mentors).find(mentor => mentor.buddyId === userId),
    ),
    RD.getOrElse<unknown, undefined | mentorsApi.Mentor>(() => undefined),
  );

export const get = ({ mentors }: types.AppState) =>
  RD.remoteData.map(mentors, mentorRecord => Object.values(mentorRecord));

const withSelectedSkills =
  (skills: Array<string>) => (mentor: mentorsApi.Mentor) =>
    skills.length > 0
      ? mentor.skills.filter(e => skills.includes(e)).length > 0
      : true;

const withVacationing =
  (showVacation: boolean) => (mentor: mentorsApi.Mentor) =>
    showVacation ? !mentor.is_vacationing : true;

export const selectMentorList = (appState: types.AppState) => {
  const remoteMentors = get(appState);
  const { skillFilter, shouldHideInactiveMentors } = appState['filterMentors'];

  return RD.remoteData.map(remoteMentors, mentors =>
    mentors
      .filter(withSelectedSkills(skillFilter))
      .filter(withVacationing(shouldHideInactiveMentors)),
  );
};

export const select = ({ mentors: state }: types.AppState) => state;

export const getMentorFormData =
  (buddyId: string) => (appState: types.AppState) => {
    const mentor = getMentorByUserId(buddyId)(appState);
    const account = getAccount(appState);

    return { mentor, account };
  };
