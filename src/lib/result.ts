export type Err<A> = {
  type: 'Err';
  error: A;
};

export type Ok<A> = {
  type: 'Ok';
  value: A;
};

export type Result<A, E> = Ok<A> | Err<E>;

export function err<E>(error: E) {
  return {
    type: 'Err' as const,
    error,
  };
}

export function ok<Value>(value: Value) {
  return {
    type: 'Ok' as const,
    value,
  };
}

export function bimap<A, E, B, F>(
  result: Result<A, E>,
  f: (a: A) => B,
  g: (e: E) => F,
): Result<B, F> {
  if (result.type === 'Ok') {
    return ok(f(result.value));
  } else {
    return err(g(result.error));
  }
}

export function chain<A, E, B>(
  result: Result<A, E>,
  f: (a: A) => B,
): Err<E> | B {
  if (result.type === 'Ok') {
    return f(result.value);
  } else {
    return result;
  }
}

function id<A>(a: A): A {
  return a;
}
export function map<A, E, B>(
  result: Result<A, E>,
  f: (a: A) => B,
): Result<B, E> {
  return bimap(result, f, id);
}
export function mapErr<A, E, F>(result: Result<A, E>, g: (e: E) => F) {
  return bimap(result, id, g);
}

export function append<A, E, B>(
  first: Result<A, E>,
  second: Result<B, E>,
): Result<[A, B], E> {
  if (first.type === 'Err') return first;
  if (second.type === 'Err') return second;
  return ok([first.value, second.value]);
}
