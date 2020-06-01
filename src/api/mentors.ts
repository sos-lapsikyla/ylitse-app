import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';

import isFinnishPhone from '../lib/isFinnishPhone';
import * as http from '../lib/http';

import * as config from './config';
import * as topicApi from './topic-storage';

type ApiMentor = t.TypeOf<typeof mentorType>;
const mentorType = t.strict({
  user_id: t.string,
  birth_year: t.number,
  display_name: t.string,
  story: t.string,
  region: t.string,
  skills: t.array(t.string),
  languages: t.array(t.string),
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

export const fetchMentors: () => TE.TaskEither<
  string,
  Record<string, Mentor>
> = () =>
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

const compareTopic = (
  preferredTopic: topicApi.Topic | undefined,
  first: Mentor,
  second: Mentor,
) => {
  if (preferredTopic === undefined) {
    return 0;
  }

  const firstHasTopic = first.skills.includes(preferredTopic);
  const secondHasTopic = second.skills.includes(preferredTopic);
  if (firstHasTopic && !secondHasTopic) {
    return -1;
  }
  if (!firstHasTopic && secondHasTopic) {
    return 1;
  }
  return 0;
};

export const compare = (
  topic: topicApi.Topic | undefined,
  userId: string | undefined,
) => (a: Mentor, b: Mentor) => {
  return (
    compareTopic(topic, a, b) || compareLang(a, b) || compareIds(userId, a, b)
  );
};
