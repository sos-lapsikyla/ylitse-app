import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as authApi from '../api/auth';
import * as http from '../lib/http';

import * as config from './config';

interface ITupleArray<T> extends Array<T> {
  readonly tupleArray: unique symbol;
}

const tupleArray = <C extends t.Mixed>(a: C) =>
  t.brand(
    t.array(a),
    (n: Array<C>): n is t.Branded<Array<C>, ITupleArray<C>> => n.length === 2,
    'tupleArray',
  );
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

const answerRange = t.strict({
  type: t.literal('range'),
  step: t.number,
  min: value,
  max: value,
});

const answerOptions = t.strict({
  type: t.literal('options'),
  options: tupleArray(value),
});

const question = t.strict({
  titles: localizable,
  answer: t.union([answerRange, answerOptions]),
  answer_id: t.string,
  id: t.string,
});

const questionResponse = t.strict({ resources: t.array(question) });

export type Question = t.TypeOf<typeof question>;

export function fetchQuestions(
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, Array<Question>> {
  return http.validateResponse(
    http.get(`${config.baseUrl}/feedback/needs_answers`, {
      headers: authApi.authHeader(accessToken),
    }),
    questionResponse,
    response => response.resources,
  );
}
