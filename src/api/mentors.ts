import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';
import * as record from '../lib/record';

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

export async function fetchMentors(): http.Future<record.NonTotal<Mentor>> {
  const url = `${config.baseUrl}/mentors`;
  return result.map(await http.get(url, mentorListType), ({ resources }) =>
    resources.reduce((acc, apiMentor) => {
      const mentor = toMentor(apiMentor);
      return { ...acc, [mentor.buddyId]: mentor };
    }, {}),
  );
}
