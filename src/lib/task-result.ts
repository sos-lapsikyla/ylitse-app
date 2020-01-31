import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import * as task from './task';
import * as result from './result';

export type TaskResult<A, E = unknown> = task.Task<result.Result<A, E>>;

export function bimap<Value, ErrorType, MappedValue, MappedErrorType>(
  taskResult: TaskResult<Value, ErrorType>,
  f: (v: Value) => MappedValue,
  g: (e: ErrorType) => MappedErrorType,
): TaskResult<MappedValue, MappedErrorType> {
  return task.map(taskResult, r => result.bimap(r, f, g));
}

export function map<A, E, B>(
  taskResult: TaskResult<A, E>,
  f: (a: A) => B,
): TaskResult<B, E> {
  return task.map(taskResult, value => result.map(value, f));
}

export function chain<A, E, B>(
  taskResult: TaskResult<A, E>,
  f: (a: A) => TaskResult<B, E>,
): TaskResult<B, E> {
  return task.chain(taskResult, value => {
    return result.fold(value, f, e => task.taskifyValue(result.err(e)));
  });
}

type UnpackPromise<Value> = Value extends Promise<infer U> ? U : never;
export function fromPromise<F extends (...args: any[]) => any, ErrorType>(
  promise: F,
  args: Parameters<F>,
  errorHandler: (u: unknown) => ErrorType,
): TaskResult<UnpackPromise<ReturnType<F>>, ErrorType> {
  return {
    run: async () => {
      try {
        return result.ok(await promise(...args));
      } catch (e) {
        const err: unknown = e;
        return result.err(errorHandler(err));
      }
    },
  };
}

export type UnknownError = {
  type: 'UnknownError';
  error: unknown;
};
export function unknownError(error: unknown): UnknownError {
  return {
    type: 'UnknownError',
    error,
  };
}

export function handleError<A>(
  typeModel: t.Type<A, A, unknown>,
): (u: unknown) => A | UnknownError {
  return (u: unknown) =>
    pipe(
      typeModel.decode(u),
      E.fold(unknownError, (a: A) => a as A | UnknownError),
    );
}
