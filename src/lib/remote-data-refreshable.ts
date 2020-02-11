import * as remoteData from './remote-data';
import * as taggedUnion from './tagged-union';

export type NotAsked = remoteData.NotAsked;
export const notAsked = remoteData.notAsked;

export type Loading = remoteData.Loading;
export const loading = remoteData.loading;

export type Err<E> = remoteData.Err<E>;
export const err = remoteData.err;

export type Ok<A> = remoteData.Ok<A>;
export const ok = remoteData.ok;

export type Refreshing<A> = {
  type: 'Refreshing';
  value: A;
};
export function refreshing<A>(value: A): Refreshing<A> {
  return {
    type: 'Refreshing',
    value,
  };
}

export type RefreshingFailure<A, E> = {
  type: 'RefreshingFailure';
  value: A;
  error: E;
};
export function refreshingFailure<A, E>(
  value: A,
  error: E,
): RefreshingFailure<A, E> {
  return {
    type: 'RefreshingFailure',
    value,
    error,
  };
}

export type Refreshable<A, E> =
  | remoteData.RemoteData<A, E>
  | Refreshing<A>
  | RefreshingFailure<A, E>;

export function toRemoteData<A, E>(
  refreshable: Refreshable<A, E>,
): remoteData.RemoteData<A, E> {
  return taggedUnion.match(refreshable, {
    NotAsked: a => a,
    Loading: a => a,
    Err: a => a,
    Ok: ({ value }) => remoteData.ok(value),
    Refreshing: ({ value }) => remoteData.ok(value),
    RefreshingFailure: ({ value }) => remoteData.ok(value),
  });
}
