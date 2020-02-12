import * as taggedUnion from './tagged-union';

type None = { type: 'None' };
type Some<A> = { type: 'Some'; value: A };
export type Option<A> = None | Some<A>;

export const none: None = { type: 'None' };
export function some<A>(a: A): Some<A> {
  return { type: 'Some', value: a };
}

export function map<A, B>(option: Option<A>, func: (a: A) => B): Option<B> {
  return taggedUnion.match(option, {
    Some: ({ value }) => some(func(value)),
    None: none,
  });
}
