import * as t from 'io-ts';

import * as http from '../lib/http';

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

const mentorsUrl = 'https://admin.ylitse.fi/api/mentors';
export async function fetchMentors(): Promise<Map<string, Mentor>> {
  const { resources } = await http.get(mentorsUrl, mentorListType);
  return resources.reduce((acc: Map<string, Mentor>, apiMentor: ApiMentor) => {
    const mentor = toMentor(apiMentor);
    return acc.set(mentor.id, mentor);
  }, new Map());
}
