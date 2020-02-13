import * as remoteData from './remote-data';
import * as taggedUnion from './tagged-union';

export type Deferred = {
  type: 'Deferred';
};
export const deferred: Deferred = { type: 'Deferred' };

export type Retrying = {
  type: 'Retrying';
};
export const retrying: Retrying = { type: 'Retrying' };

export type Retryable<A, E> = remoteData.RemoteData<A, E> | Deferred | Retrying;

export function toRemoteData<A, E>(
  retryable: Retryable<A, E>,
): remoteData.RemoteData<A, E> {
  return taggedUnion.match(retryable, {
    NotAsked: () => remoteData.notAsked,
    Loading: () => remoteData.loading,
    Deferred: () => remoteData.loading,
    Retrying: () => remoteData.loading,
    Err: ({ error }) => remoteData.err(error),
    Ok: ({ value }) => remoteData.ok(value),
  });
}
