/* global Response */
import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import isFinnishPhone from '../lib/isFinnishPhone';
import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';

type ApiMentor = t.TypeOf<typeof mentorType>;

const mentorType = t.strict({
  user_id: t.string,
  id: t.string,
  birth_year: t.number,
  display_name: t.string,
  story: t.string,
  region: t.string,
  skills: t.array(t.string),
  languages: t.array(t.string),
  is_vacationing: t.boolean,
  status_message: t.string,
});
const mentorListType = t.strict({ resources: t.array(mentorType) });

export type Mentor = ReturnType<typeof toMentor>;

const toMentor = ({
  birth_year,
  display_name,
  user_id,
  id,
  ...props
}: ApiMentor) => ({
  ...props,
  mentorId: id,
  buddyId: user_id,
  age: new Date().getFullYear() - birth_year,
  name: display_name,
});

export type Mentors = Record<string, Mentor>;

const fromMentorList = ({ resources }: t.TypeOf<typeof mentorListType>) =>
  resources.reduce((acc: Mentors, apiMentor) => {
    const mentor = toMentor(apiMentor);

    return { ...acc, [mentor.buddyId]: mentor };
  }, {});

export const fetchMentors: () => TE.TaskEither<string, Record<string, Mentor>> =
  () =>
    http.validateResponse(
      http.get(`${config.baseUrl}/mentors`),
      mentorListType,
      fromMentorList,
    );

export function compareLang(a: Mentor, b: Mentor) {
  if (isFinnishPhone) {
    return 0;
  }

  const lang = 'Italian';
  const hasLang = ({ languages }: Mentor) => languages.includes(lang);

  if (hasLang(a) && !hasLang(b)) {
    return -1;
  }

  if (!hasLang(a) && hasLang(b)) {
    return 1;
  }

  return 0;
}

const compareIds = (userId: string | undefined, a: Mentor, b: Mentor) => {
  const x: number = userId ? userId.charCodeAt(0) : 0;
  const y = a.buddyId.charCodeAt(0);
  const z = b.buddyId.charCodeAt(0);

  return Math.abs(x - z) - Math.abs(x - y);
};

const sortVacationing = (a: Mentor, b: Mentor) => {
  return a.is_vacationing === b.is_vacationing ? 0 : a ? -1 : 1;
};

export const compare =
  (userId: string | undefined) => (a: Mentor, b: Mentor) => {
    return (
      sortVacationing(a, b) || compareLang(a, b) || compareIds(userId, a, b)
    );
  };

type VacationStatusParams = {
  is_vacationing: boolean;
  status_message: string;
};

const vacationStatusRequest = (
  mentorId: string,
  data: VacationStatusParams,
  token: authApi.AccessToken,
) => {
  return http.patch(`${config.baseUrl}/mentors/${mentorId}`, data, {
    headers: authApi.authHeader(token),
  });
};

export function changeVacationStatus(
  mentor: Mentor,
): (token: authApi.AccessToken) => TE.TaskEither<string, Response> {
  const data = {
    is_vacationing: !mentor.is_vacationing,
    status_message: mentor.status_message,
  };

  return token =>
    http.response(vacationStatusRequest(mentor.mentorId, data, token));
}

export function changeStatusMessage({
  statusMessage,
  mentor,
}: {
  statusMessage: string;
  mentor: Mentor;
}): (token: authApi.AccessToken) => TE.TaskEither<string, Response> {
  const data = {
    is_vacationing: mentor.is_vacationing,
    status_message: statusMessage,
  };

  return token =>
    http.response(vacationStatusRequest(mentor.mentorId, data, token));
}
