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

export function getActiveFilters({
  filterMentors,
}: types.AppState): string {
  const amount = filterMentors.skillFilter.length;

  if (amount === 0) {
    return localization.trans('main.mentorsTitleAndSearchButton');
  }

  return `${localization.trans(
    'main.mentorsTitleAndSearchButtonFiltersActive',
  )}: ${amount}`;
}

const emptySkillList: string[] = [];
let prevSkillList = emptySkillList;

export const getSkillList = (state: types.AppState) => {
  const remoteDataMentorList = get(state);

  const nextSkillList = pipe(
    remoteDataMentorList,
    RD.getOrElse<unknown, mentorsApi.Mentor[]>(() => []),
  )
    .map(mentor => mentor.skills)
    .flat()
    .filter((item, index, self) => self.indexOf(item) === index)
    .sort();

  if (
    prevSkillList.length === nextSkillList.length &&
    prevSkillList.every((skill, i) => skill === nextSkillList[i])
  ) {
    return prevSkillList;
  }

  prevSkillList = nextSkillList.length === 0 ? emptySkillList : nextSkillList;

  return prevSkillList;
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
  (selectedSkills: Array<string>) => (mentor: mentorsApi.Mentor) =>
    selectedSkills.length > 0
      ? mentor.skills.some(skill => selectedSkills.includes(skill))
      : true;

const withVacationing =
  (hideVacationing: boolean) => (mentor: mentorsApi.Mentor) =>
    hideVacationing ? !mentor.is_vacationing : true;

let prevMentorList: RD.RemoteData<string, mentorsApi.Mentor[]> = RD.initial;

export const selectMentorList = (appState: types.AppState) => {
  const remoteMentors = get(appState);
  const { skillFilter, shouldHideInactiveMentors } = appState.filterMentors;

  const nextMentorList = RD.remoteData.map(remoteMentors, mentors =>
    mentors
      .filter(withSelectedSkills(skillFilter))
      .filter(withVacationing(shouldHideInactiveMentors)),
  );

  if (
    RD.isSuccess(prevMentorList) &&
    RD.isSuccess(nextMentorList) &&
    prevMentorList.value.length === nextMentorList.value.length &&
    prevMentorList.value.every(
      (mentor, i) => mentor === nextMentorList.value[i],
    )
  ) {
    return prevMentorList;
  }

  prevMentorList = nextMentorList;

  return nextMentorList;
};

export const select = ({ mentors: state }: types.AppState) => state;
