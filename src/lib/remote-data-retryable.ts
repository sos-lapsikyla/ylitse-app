import * as remoteData from './remote-data';
import * as taggedUnion from './tagged-union';

type Lift<A extends {}, Args extends any[]> = A & { args: Args };

export type NotAsked = remoteData.NotAsked;
export const notAsked = remoteData.notAsked;

export type Loading<Args extends any[]> = Lift<remoteData.Loading, Args>;
export function loading<Args extends any[]>(args: Args): Loading<Args> {
  return { ...remoteData.loading, args: args };
}

export type Ok<Value, Args extends any[]> = Lift<remoteData.Ok<Value>, Args>;
export function ok<Value, Args extends any[]>(
  value: Value,
  args: Args,
): Ok<Value, Args> {
  return { ...remoteData.ok(value), args: args };
}

export type Err<E, Args extends any[]> = Lift<remoteData.Err<E>, Args>;
export function err<E, Args extends any[]>(error: E, args: Args): Err<E, Args> {
  return { ...remoteData.err(error), args: args };
}

export type Deferred<Args extends any[]> = {
  type: 'Deferred';
  args: Args;
};
export function deferred<Args extends any[]>(args: Args): Deferred<Args> {
  return { type: 'Deferred', args: args };
}

export type Retrying<Args extends any[]> = {
  type: 'Retrying';
  args: Args;
};
export function retrying<Args extends any[]>(args: Args): Retrying<Args> {
  return { type: 'Retrying', args: args };
}

export type Retryable<A, E, Args extends any[]> =
  | NotAsked
  | Loading<Args>
  | Deferred<Args>
  | Retrying<Args>
  | Err<E, Args>
  | Ok<A, Args>;

export function toRemoteData<A, E, Args extends any[]>(
  retryable: Retryable<A, E, Args>,
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
