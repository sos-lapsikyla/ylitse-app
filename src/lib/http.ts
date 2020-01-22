// TODO post, put functionality

import * as t from 'io-ts';
import * as tPromise from 'io-ts-promise';

class HTTPError extends Error {}

async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new HTTPError(`HTTPError, status: ${response.status}`);
  }
  return response.json();
}

export async function get<A>(
  url: string,
  type: t.Type<A, A, unknown>,
  options?: RequestInit,
): Promise<A> {
  const json = await request(url, options);
  return tPromise.decode(type, json);
}

export async function post<A extends {}, B>(
  url: string,
  input: A,
  outputType: t.Type<B, B, unknown>,
  options?: RequestInit,
): Promise<B> {
  const requestOptions: RequestInit = {
    ...options,
    method: 'POST',
    body: JSON.stringify(input),
  };
  const responseJson = await request(url, requestOptions);
  return tPromise.decode(outputType, responseJson);
}
