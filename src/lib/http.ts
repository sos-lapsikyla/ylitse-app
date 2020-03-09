import * as t from 'io-ts';
import * as tPromise from 'io-ts-promise';

import * as r from './result';
import * as f from './future';

import * as err from './http-err';

export type Future<A> = f.Future<A, err.Err>;
async function request(url: string, options?: RequestInit): Future<Response> {
  const response = await f.fromPromise(fetch, [url, options], (_: unknown) =>
    err.unknownError(),
  );
  return r.chain(response, resp =>
    resp.ok ? r.ok(resp) : r.err(err.badStatus(resp.status)),
  );
}

async function request_json(
  url: string,
  options?: RequestInit,
): Future<unknown> {
  return f.chain(await request(url, options), async response => {
    try {
      return r.ok(await response.json());
    } catch (e) {
      return r.err(err.unknownError());
    }
  });
}

export async function head(
  url: string,
  options?: RequestInit,
): Future<Response> {
  return request(url, { ...options, method: 'HEAD' });
}

async function decode<A, B>(
  typeModel: t.Type<A, B, unknown>,
  value: unknown,
): Future<A> {
  try {
    const decoded = await tPromise.decode(typeModel, value);
    return r.ok(decoded);
  } catch (errors) {
    return r.err(err.badModel(errors));
  }
}

export async function get<A, B>(
  url: string,
  type: t.Type<A, B, unknown>,
  options?: RequestInit,
): Future<A> {
  return f.chain(await request_json(url, options), json => decode(type, json));
}

export async function post<A extends {}, B, C>(
  url: string,
  input: A,
  outputType: t.Type<B, C, unknown>,
  options?: RequestInit,
): Future<B> {
  const requestOptions: RequestInit = {
    ...options,
    method: 'POST',
    body: JSON.stringify(input),
  };
  return f.chain(await request_json(url, requestOptions), json =>
    decode(outputType, json),
  );
}

export async function put<A extends {}, B, C>(
  url: string,
  input: A,
  outputType: t.Type<B, C, unknown>,
  options?: RequestInit,
): Future<B> {
  const requestOptions: RequestInit = {
    ...options,
    method: 'PUT',
    body: JSON.stringify(input),
  };
  return f.chain(await request_json(url, requestOptions), json =>
    decode(outputType, json),
  );
}
