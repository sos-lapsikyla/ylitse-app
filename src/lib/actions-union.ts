// Ensures that action name is same as action creator name
export type ActionCreator<Key> = (...args: any) => { type: Key; payload: any };

type ActionCreatorsMapObject<K extends string | number | symbol> = {
  [key in K]: ActionCreator<key>;
};

export type ActionsUnion<
  A extends ActionCreatorsMapObject<keyof A>
> = ReturnType<A[keyof A]>;
