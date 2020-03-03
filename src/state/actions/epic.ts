import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import * as E from 'fp-ts/lib/Either';
import { Deps } from '../deps';
import { AppState as State } from '../model';
import * as regular from './regular';

export type UnpackObservableEither<T> = T extends RE.ObservableEither<
  infer E,
  infer A
>
  ? E.Either<E, A>
  : never;

export type TypeFilter = {
  [F in keyof Deps]: {
    [A in regular.Action['type']]: {
      args: (state: State) => Parameters<Deps[F]>;
      f: F;
      onComplete: (
        result: UnpackObservableEither<ReturnType<Deps[F]>>,
      ) => regular.Action;
    };
  };
};

export type FetchCmd = {
  type: 'FetchCmd';
} & TypeFilter[keyof Deps][regular.Action['type']];
