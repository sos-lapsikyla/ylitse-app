import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as authApi from '../api/auth';
import * as http from '../lib/http';
import { pipe } from 'fp-ts/lib/pipeable';

import * as config from './config';

export const langCode = t.keyof({
  fi: null,
  en: null,
});

const localizable = t.record(langCode, t.string);

const value = t.strict({
  value: t.number,
  labels: localizable,
});

export type Value = t.TypeOf<typeof value>;

const rangeQuestion = t.strict({
  type: t.literal('range'),
  step: t.number,
  min: value,
  max: value,
});

const yesNoQuestion = t.strict({
  type: t.literal('yes-no'),
  yes: value,
  no: value,
});

const question = t.strict({
  titles: localizable,
  answer: t.union([rangeQuestion, yesNoQuestion]),
  answer_id: t.string,
  id: t.string,
});

const questionResponse = t.strict({ resources: t.array(question) });

export type Question = t.TypeOf<typeof question>;

export function fetchQuestions(
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, Array<Question>> {
  console.log('going to fetch questions');

  return http.validateResponse(
    http.get(`${config.baseUrl}/feedback/needs_answers`, {
      headers: authApi.authHeader(accessToken),
    }),
    questionResponse,
    response => response.resources,
  );
}

export type Answer = {
  answer_id: string;
  value: number;
};
export const sendAnswer =
  (answer: Answer) =>
  (accessToken: authApi.AccessToken): TE.TaskEither<string, undefined> => {
    const url = `${config.baseUrl}/feedback/answer`;

    return pipe(
      http.post(url, answer, {
        headers: authApi.authHeader(accessToken),
      }),
      TE.map(_ => undefined),
    );
  };
