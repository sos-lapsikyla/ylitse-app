import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, identity } from 'fp-ts/lib/function';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = 'ChosedTopic';

export type Topic = keyof typeof topics;
export const topics = {
  Lastensuojelu: null,
  'Lasinen lapsuus': null,
  'Vanhemmat lastensuojelussa': null,
};

const topicType = t.keyof(topics);
const decode = flow(
  topicType.decode,
  O.fromEither,
);

export const readTopic = pipe(
  TE.tryCatch(
    () => AsyncStorage.getItem(storageKey),
    () => 'Failed to read from disk.',
  ),
  TE.chain(
    flow(
      decode,
      O.fold(() => TE.left('No topic found'), token => TE.right(token)),
    ),
  ),
);

export const store = (topic: O.Option<Topic>) => {
  return pipe(
    topic,
    O.fold(() => '', identity),
    _topic =>
      TE.tryCatch(
        () => AsyncStorage.setItem(storageKey, _topic),
        () => 'Failed to write topic to disk.',
      ),
  );
};
