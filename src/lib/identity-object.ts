import objectKeys from './object-keys';

export type IdentityObject<K extends string> = {
  [k in K]: k;
};

export default function identityObject<K extends string>(
  object: { [k in K]: unknown },
): IdentityObject<K> {
  return objectKeys(object).reduce(
    (acc, key) => ({ ...acc, [key]: key }),
    {},
  ) as IdentityObject<K>;
}
