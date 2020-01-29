// Idea from https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/

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

export type Failure<A> = {
  type: 'Failure';
  error: A;
};

export type Success<A> = {
  type: 'Success';
  value: A;
};

export type RemoteData<A, E = unknown> =
  | Success<A>
  | Failure<E>
  | Loading
  | NotAsked;

export function isLoading<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Loading';
}

export function isFailure<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Failure';
}

export function isSuccess<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Success';
}

export function fail<E>(error: E) {
  return {
    type: 'Failure' as const,
    error,
  };
}

export function succeed<Value>(value: Value) {
  return {
    type: 'Success' as const,
    value,
  };
}

export function unwrap<A, E, Output>(
  remoteData: RemoteData<A, E>,
  f: (v: A) => Output,
  defaultValue: Output,
): Output {
  if (remoteData.type === 'Success') {
    return f(remoteData.value);
  } else {
    return defaultValue;
  }
}
