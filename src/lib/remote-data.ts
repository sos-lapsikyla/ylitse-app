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

type Failure<A> = {
  type: 'Failure';
  error: A;
};

type Success<A> = {
  type: 'Success';
  value: A;
};

export type RemoteData<A, E = Error> =
  | Success<A>
  | Failure<E>
  | Loading
  | NotAsked;

export function isLoading<A, E>(remoteData: RemoteData<A, E>): boolean {
  return remoteData.type === 'Loading';
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

type UnpackPromise<Value> = Value extends Promise<infer U> ? U : never;
export async function fromPromise<F extends (...args: any[]) => any>(
  promiseFunction: F,
  args: Parameters<F>,
): Promise<RemoteData<UnpackPromise<F>>> {
  try {
    const value = await promiseFunction(args);
    return succeed(value);
  } catch (e) {
    return fail(e);
  }
}
