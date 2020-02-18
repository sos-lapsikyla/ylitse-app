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

export type NonTotal<A> = Partial<{
  [k: string]: A;
}>;
