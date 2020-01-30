// Idea from https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/
import * as result from './result';
import assertNever from './assert-never';

type NotAsked = {
  type: 'NotAsked';
};
export const notAsked: NotAsked = {
  type: 'NotAsked',
};

type Loading = {
  type: 'Loading';
};
export const loading: Loading = {
  type: 'Loading',
};

export type RemoteData<A, E = unknown> =
  | result.Result<A, E>
  | Loading
  | NotAsked;

export function isLoading<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Loading';
}

export function isFailure<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Err';
}

export function isSuccess<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Ok';
}

export const ok = result.ok;
export const err = result.err;

export function unwrap<A, E, Output>(
  remoteData: RemoteData<A, E>,
  f: (v: A) => Output,
  defaultValue: Output,
): Output {
  if (remoteData.type === 'Ok') {
    return f(remoteData.value);
  } else {
    return defaultValue;
  }
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
