export function tuple<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

export function fst<A, B>(ab: [A, B]): A {
  return ab[0];
}

export function snd<A, B>(ab: [A, B]): B {
  return ab[1];
}

export function mapFst<A, B, C>([a, b]: [A, B], func: (a: A) => C): [C, B] {
  return tuple(func(a), b);
}

export function mapSnd<A, B, C>([a, b]: [A, B], func: (b: B) => C): [A, C] {
  return tuple(a, func(b));
}

export function swap<A, B>([a, b]: [A, B]): [B, A] {
  return tuple(b, a);
}
