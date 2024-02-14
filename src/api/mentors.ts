import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import * as http from '../lib/http';

import * as config from './config';
import * as authApi from './auth';
import { UserAccount } from './account';

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
  gender: t.string,
  communication_channels: t.array(t.string),
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

export const toApiMentor = ({
  mentorId,
  buddyId,
  age,
  name,
  ...props
}: Mentor & { account_id: string }) => ({
  ...props,
  birth_year: new Date().getFullYear() - age,
  display_name: name,
  user_id: buddyId,
  id: mentorId,
});

const putMentor = (mentor: ApiMentor, token: authApi.AccessToken) => {
  return http.put(`${config.baseUrl}/mentors/${mentor.id}`, mentor, {
    headers: authApi.authHeader(token),
  });
};

export function updateMentor(
  mentor: Mentor,
  account: UserAccount,
): (token: authApi.AccessToken) => TE.TaskEither<string, Mentor> {
  return token =>
    http.validateResponse(
      putMentor(
        toApiMentor({ ...mentor, account_id: account.accountId }),
        token,
      ),
      mentorType,
      toMentor,
    );
}
export type Mentors = Record<string, Mentor>;

const fromMentorList = ({ resources }: t.TypeOf<typeof mentorListType>) =>
  resources.reduce((acc: Mentors, apiMentor) => {
    const mentor = toMentor(apiMentor);

    return { ...acc, [mentor.buddyId]: mentor };
  }, {});

export const fetchMentors: () => TE.TaskEither<
  string,
  Record<string, Mentor>
> = () =>
  http.validateResponse(
    http.get(`${config.baseUrl}/mentors`),
    mentorListType,
    fromMentorList,
  );

const compareIds = (userId: string | undefined) => (a: Mentor, b: Mentor) => {
  const x: number = userId ? userId.charCodeAt(0) : 0;
  const y = a.buddyId.charCodeAt(0);
  const z = b.buddyId.charCodeAt(0);

  return Math.abs(x - z) - Math.abs(x - y);
};

const byMe = (myUserId: string | undefined) => (a: Mentor, b: Mentor) => {
  if (a.buddyId === myUserId) {
    return -1;
  }

  if (b.buddyId === myUserId) {
    return 1;
  }

  return 0;
};

const byStatus = (a: Mentor, b: Mentor) => {
  if (a.is_vacationing && !b.is_vacationing) {
    return 1;
  }

  if (b.is_vacationing && !a.is_vacationing) {
    return -1;
  }

  return 0;
};

export const sort = (userId: string | undefined, mentorList: Array<Mentor>) =>
  [...mentorList].sort(compareIds(userId)).sort(byStatus).sort(byMe(userId));
