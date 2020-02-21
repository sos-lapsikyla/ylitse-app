export function singleton<K extends string, V>(k: K, v: V) {
  return { [k]: v } as { [k in K]: V };
}

export function keys<K extends string>(object: { [k in K]: unknown }): K[] {
  return Object.keys(object) as K[];
}

export type IdentityObject<K extends string> = {
  [k in K]: k;
};

export function identityObject<K extends string>(
  object: { [k in K]: unknown },
): IdentityObject<K> {
  return keys(object).reduce(
    (acc, key) => ({ ...acc, [key]: key }),
    {},
  ) as IdentityObject<K>;
}

export type NonTotal<A, Key extends string = string> = Partial<
  {
    [k in Key]: A;
  }
>;

export function map<K extends string, A, B>(
  record: Record<K, A>,
  fn: (a: A, k: K) => B,
): Record<K, B> {
  return keys(record).reduce(
    (acc: Partial<Record<K, B>>, k) => ({
      ...acc,
      [k]: fn(record[k], k),
    }),
    {},
  );
}

export function filter<K extends string, A, B>(
  record: Record<K, A>,
  predicate: (a: A, k: K) => B,
): Partial<Record<K, A>> {
  return keys(record).reduce(
    (acc: Partial<Record<K, A>>, k) =>
      predicate(record[k], k)
        ? {
            ...acc,
            [k]: record[k],
          }
        : acc,
    {},
  );
}
