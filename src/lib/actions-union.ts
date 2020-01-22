// Ensures that action name is same as action creator name
export type ActionCreator<Key> = (...args: any) => { type: Key; payload: any };

type ActionCreatorsMapObject<K extends string> = {
  [key in K]: ActionCreator<key>;
};

export type ActionsUnion<
  K extends string,
  A extends ActionCreatorsMapObject<K>
> = ReturnType<A[keyof A]>;
