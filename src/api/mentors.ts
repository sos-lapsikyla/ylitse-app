import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';

import * as config from './config';

type ApiMentor = t.TypeOf<typeof mentorType>;
const mentorType = t.strict({
  id: t.string,
  birth_year: t.number,
  display_name: t.string,
  story: t.string,
  region: t.string,
  skills: t.array(t.string),
});
const mentorListType = t.strict({ resources: t.array(mentorType) });

export type Mentor = ReturnType<typeof toMentor>;
const toMentor = ({ birth_year, display_name, ...props }: ApiMentor) => ({
  ...props,
  age: new Date().getFullYear() - birth_year,
  name: display_name,
});

export async function fetchMentors(): http.Future<Map<string, Mentor>> {
  const url = `${config.baseUrl}/mentors`;
  return result.map(await http.get(url, mentorListType), ({ resources }) =>
    resources.reduce((acc: Map<string, Mentor>, apiMentor: ApiMentor) => {
      const mentor = toMentor(apiMentor);
      return acc.set(mentor.id, mentor);
    }, new Map()),
  );
}
