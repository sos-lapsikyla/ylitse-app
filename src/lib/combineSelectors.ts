type Mapping<K extends string | number | symbol, S> = {
  [Key in K]: (s: S) => any;
};

export default function combineSelectors<S, A extends Mapping<keyof A, S>>(
  state: S,
  mapping: A,
): {
  [K in keyof A]: ReturnType<A[K]>;
} {
  const keysAny: any = Object.keys(mapping);
  const keys: Array<keyof A> = keysAny;

  const selectedAny: any = keys.reduce((acc: any, k) => ({
    ...acc,
    [k]: mapping[k](state),
  }));
  return selectedAny;
}
