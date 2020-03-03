import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import * as err from './http-err';

const request = (url: string, options: RequestInit) =>
  pipe(
    TE.tryCatch(() => fetch(url, options), err.unknownError),
    TE.chain(response =>
      response.ok
        ? TE.right(response)
        : TE.left(err.badStatus(response.status)),
    ),
  );

export const get = (url: string, options?: RequestInit) =>
  request(url, { ...(options || {}), method: 'GET' });
export const head = (url: string, options?: RequestInit) =>
  request(url, {
    method: 'HEAD',
    ...(options || {}),
  });
export const post = (url: string, body: any, options?: RequestInit) =>
  request(url, {
    body: JSON.stringify(body),
    method: 'POST',
    ...(options || {}),
  });
export const put = (url: string, body: any, options?: RequestInit) =>
  request(url, {
    body: JSON.stringify(body),
    method: 'PUT',
    ...(options || {}),
  });

const getJson = (response: Response) =>
  TE.tryCatch(() => response.json(), err.unknownError);

const decode = <A, B>(model: t.Type<A, B, unknown>) => (u: unknown) =>
  pipe(
    u,
    model.decode,
    E.mapLeft((errors: t.Errors) => err.badModel(errors)),
    TE.fromEither,
  );

export const validateResponse = <A, B, C>(
  task: TE.TaskEither<err.Err, Response>,
  model: t.Type<A, B, unknown>,
  fromModel: (a: A) => C,
) =>
  pipe(
    task,
    TE.chain(getJson),
    TE.chain(decode(model)),
    TE.map(fromModel),
  );
