import * as remoteData from './remote-data';
import * as retryable from './remote-data-retryable';

export type NotAsked = retryable.NotAsked;
export const notAsked = retryable.notAsked;

export type Loading<Args extends any[]> = retryable.Loading<Args>;
export const loading = retryable.loading;

export type Deferred<Args extends any[]> = retryable.Deferred<Args>;
export const deferred = retryable.deferred;

export type Retrying<Args extends any[]> = retryable.Retrying<Args>;
export const retrying = retryable.retrying;

export type Err<E, Args extends any[]> = retryable.Err<E, Args>;
export const err = retryable.err;

export type Ok<A, E, Args extends any[]> = retryable.Ok<A, Args> & {
  nextValue: Exclude<retryable.Retryable<A, E, Args>, retryable.Ok<A, Args>>;
};
export function ok<A, E, Args extends any[]>(
  value: A,
  args: Args,
): Ok<A, E, Args> {
  return {
    ...retryable.ok(value, args),
    nextValue: notAsked,
  };
}

export type Refreshable<A, E, Args extends any[]> =
  | Exclude<retryable.Retryable<A, E, Args>, retryable.Ok<A, Args>>
  | Ok<A, E, Args>;

export function toRemoteData<A, E, Args extends any[]>(
  refreshable: Refreshable<A, E, Args>,
): remoteData.RemoteData<A, E> {
  return retryable.toRemoteData(refreshable);
}
