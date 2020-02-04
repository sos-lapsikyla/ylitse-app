// import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export default function taggedError<A extends string>(names: readonly A[]) {
  const namedTypes = names.map(a => t.literal(a));
  const errorType = t.strict({
    tag: t.union([
      t.literal('UnknownError'),
      t.literal('UnknownError'),
      ...namedTypes,
    ]),
  });
  const errorMaker: <A>(a: A) => { tag: A } = <A>(a: A) => ({ tag: a });
  const errorDecoder = (u: unknown) => {
    const either = errorType.decode(u);
    const fold = E.fold(
      _ => ({ tag: 'UnknownError' as const }),
      (err: t.TypeOf<typeof errorType>) => err,
    );
    return fold(either);
  };
  return {
    errorType,
    errorMaker,
    errorDecoder,
  };
}