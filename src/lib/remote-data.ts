// Idea from https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/

import * as result from './result';
import assertNever from './assert-never';

export type NotAsked = {
  type: 'NotAsked';
};
export const notAsked: NotAsked = {
  type: 'NotAsked',
};
export type Loading = {
  type: 'Loading';
};
export const loading: Loading = {
  type: 'Loading',
};
export type Err<E> = result.Err<E>;
export const ok = result.ok;
export type Ok<A> = result.Ok<A>;
export const err = result.err;

export type RemoteData<A, E> = NotAsked | Loading | Err<E> | Ok<A>;

export function fromResult<A, E>(a: result.Result<A, E>): RemoteData<A, E> {
  return a;
}

export function isNotAsked<A, E>(
  remoteData: RemoteData<A, E>,
): remoteData is NotAsked {
  return remoteData.type === 'NotAsked';
}

export function isLoading<A, E>(
  remoteData: RemoteData<A, E>,
): remoteData is Loading {
  return remoteData.type === 'Loading';
}

export function isErr<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Err';
}

export function isOk<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Ok';
}

function id<A>(a: A): A {
  return a;
}
export function bimap<A, E, B, F>(
  remoteData: RemoteData<A, E>,
  f: (a: A) => B,
  g: (e: E) => F,
): RemoteData<B, F> {
  switch (remoteData.type) {
    case 'NotAsked':
    case 'Loading':
      return remoteData;
    case 'Err':
    case 'Ok':
      return result.bimap(remoteData, f, g);
    default:
      assertNever(remoteData);
  }
}
export function map<A, E, B>(
  remoteData: RemoteData<A, E>,
  f: (a: A) => B,
): RemoteData<B, E> {
  return bimap(remoteData, f, id);
}
export function mapErr<A, E, F>(
  remoteData: RemoteData<A, E>,
  g: (e: E) => F,
): RemoteData<A, F> {
  return bimap(remoteData, id, g);
}

export function chain<A, E, Output>(
  remoteData: RemoteData<A, E>,
  f: (v: A) => Output,
): NotAsked | Loading | result.Err<E> | Output {
  switch (remoteData.type) {
    case 'NotAsked':
    case 'Loading':
    case 'Err':
      return remoteData;
    case 'Ok':
      return f(remoteData.value);
    default:
      assertNever(remoteData);
  }
}

export function chainErr<A, E, Output>(
  remoteData: RemoteData<A, E>,
  f: (e: E) => Output,
): NotAsked | Loading | result.Ok<A> | Output {
  switch (remoteData.type) {
    case 'NotAsked':
    case 'Loading':
    case 'Ok':
      return remoteData;
    case 'Err':
      return f(remoteData.error);
    default:
      assertNever(remoteData);
  }
}

export function append<A, B, E>(
  first: RemoteData<A, E>,
  second: RemoteData<B, E>,
): RemoteData<[A, B], E> {
  return chain(first, a => chain(second, b => ok([a, b])));
}
