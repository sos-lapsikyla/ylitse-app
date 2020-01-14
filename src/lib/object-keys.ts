export default function objectKeys<K extends string>(
  object: { [k in K]: unknown },
): K[] {
  return Object.keys(object) as K[];
}
