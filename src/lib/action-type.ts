import * as record from './record';

export type ActionCreator<Key> = (...args: any) => { type: Key; payload: any };

export type ActionCreators<K extends string> = {
  [key in K]: ActionCreator<key>;
};

// Ensures that action name is same as action creator name
export type ActionsUnion<
  K extends string,
  A extends ActionCreators<K>
> = ReturnType<A[keyof A]>;

export type AnyAction = {
  type: string;
  payload: any;
};

export type UnknownAction = {
  type: unknown;
  payload: unknown;
};

export type Action<Name extends string, Payload> = {
  type: Name;
  payload: Payload;
};

export function make<Name extends string>(
  name: Name,
): { [K in Name]: () => Action<Name, undefined> };
export function make<Name extends string, Payload>(
  name: Name,
  payload: Payload,
): Action<Name, Payload>;
export function make<Name extends string, Payload>(
  name: Name,
  payload?: Payload,
): Action<Name, Payload> | { [K in Name]: () => Action<Name, undefined> } {
  if (payload !== undefined) {
    return {
      type: name,
      payload,
    };
  } else {
    return record.singleton(name, () => ({ type: name, payload: undefined }));
  }
}
