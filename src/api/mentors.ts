import * as t from 'io-ts';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';

import * as http from '../lib/http';
import * as err from '../lib/http-err';

import * as config from './config';

type ApiMentor = t.TypeOf<typeof mentorType>;
const mentorType = t.strict({
  user_id: t.string,
  birth_year: t.number,
  display_name: t.string,
  story: t.string,
  region: t.string,
  skills: t.array(t.string),
});
const mentorListType = t.strict({ resources: t.array(mentorType) });

export type Mentor = ReturnType<typeof toMentor>;
const toMentor = ({
  birth_year,
  display_name,
  user_id,
  ...props
}: ApiMentor) => ({
  ...props,
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

export const fetchMentors: () => RE.ObservableEither<
  err.Err,
  Record<string, Mentor>
> = () =>
  http.validateResponse(
    http.get(`${config.baseUrl}/mentors`),
    mentorListType,
    fromMentorList,
  );
