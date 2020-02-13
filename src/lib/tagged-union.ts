/* Idea from: https://github.com/Microsoft/TypeScript/pull/21316#issuecomment-364982638 */
export type TaggedUnion<
  Union,
  TagKey extends keyof Union,
  TagValue extends Union[TagKey]
> = Union extends Record<TagKey, TagValue> ? Union : never;

export type Pick<U extends { type: string }, K extends U['type']> = TaggedUnion<
  U,
  'type',
  K
>;

/* Idea from: https://gist.github.com/frankpf/cde7f792580f731dfe886ed2d91bab45 */
export type Matcher<A extends { type: string }, K extends A['type'], U> = (
  a: TaggedUnion<A, 'type', K>,
) => U;
export type MatcherRecord<A extends { type: string }, U> = {
  [K in A['type']]: Matcher<A, K, U> | U;
};

export function match<A extends { type: string }, U>(
  member: A,
  matchers:
    | MatcherRecord<A, U>
    | (Partial<MatcherRecord<A, U>> &
        (
          | {
              default(): U;
            }
          | { default: U }
        )),
): U {
  const matchersAny = matchers as any;
  let handler = matchersAny[member.type];
  if (!(member.type in matchersAny)) {
    handler = matchersAny.default;
  }
  if (typeof handler === 'function') {
    return handler(member) as U;
  }
  return handler;
}
