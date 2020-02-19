import * as result from './result';

export type Future<A, E> = Promise<result.Result<A, E>>;
export type Task<Args extends any[], Value, Err> = (
  ...args: Args
) => Future<Value, Err>;
export type ToResult<Value> = Value extends Promise<infer U> ? U : never;

type PromiseFunction<Input extends any[], Output> = (
  ...args: Input
) => Promise<Output>;
export async function fromPromise<Input extends any[], Output, E>(
  f: PromiseFunction<Input, Output>,
  args: Input,
  errorMapper: (u: unknown) => E,
): Future<Output, E> {
  try {
    const response = await f(...args);
    return result.ok(response);
  } catch (e) {
    const failure: unknown = e;
    return result.err(errorMapper(failure));
  }
}

export async function fromResult<A, E>(a: result.Result<A, E>): Future<A, E> {
  return a;
}

export function lazy<Args extends any[], A, E>(
  task: Task<Args, A, E>,
  ...args: Args
): Task<[], A, E> {
  return async () => task(...args);
}

export async function chain<A, B, E>(
  r: result.Result<A, E>,
  task: Task<[A], B, E>,
): Future<B, E> {
  if (r.type === 'Ok') {
    return task(r.value);
  } else {
    return r;
  }
}

export async function seq<A, B, E>(
  first: Task<[], A, E>,
  second: Task<[], B, E>,
): Future<[A, B], E> {
  const firstResult = await first();
  if (firstResult.type === 'Err') return firstResult;
  const secondResult = await second();
  if (secondResult.type === 'Err') return secondResult;
  return result.ok([firstResult.value, secondResult.value]);
}

export function sleep(delay: number): () => Promise<void> {
  return () =>
    new Promise(resolve => {
      setTimeout(() => {
        Promise.resolve(undefined).then(resolve);
      }, delay);
    });
}
