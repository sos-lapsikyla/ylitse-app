import * as actionType from '../../lib/action-type';

import { Env } from '../env';

import * as regular from './regular';

export type FinalReturn<F> = F extends (...args: any[]) => infer R
  ? R extends (...args: any[]) => infer S
    ? S
    : R
  : never;

export type MiddleParameters<F> = F extends (...args: any[]) => infer R
  ? R extends (...args: infer A) => any
    ? A
    : never
  : never;
/*
export type Foo<
  FuncName extends keyof Env,
  ACName extends regular.Action['type']
> = [
  [FinalReturn<Env[FuncName]>] extends MiddleParameters<
    regular.Creators[ACName]
  >
    ? FuncName
    : never,
  ACName,
];
*/

export type TypeFilter = {
  [Fn in keyof Env]: {
    [AC in regular.Action['type']]: [
      FinalReturn<Env[Fn]>,
    ] extends MiddleParameters<regular.Creators[AC]>
      ? [Fn, AC]
      : never;
  };
};

export type GoodPairs = TypeFilter[keyof Env][regular.Action['type']];

// type Faa = Foo<keyof Env, regular.Action['type']>;

type TokenRequestPayload<
  FuncName extends keyof Env,
  ACName extends regular.Action['type']
> = {
  funcName: FuncName extends keyof Env ? FuncName : never;
  funcArgs: Parameters<ReturnType<Env[FuncName]>>;

  actionCreatorName: [FinalReturn<Env[FuncName]>] extends MiddleParameters<
    regular.Creators[ACName]
  >
    ? ACName
    : never;
  actionCreatorArgs: Parameters<regular.Creators[ACName]>;
};

export type Action = {
  type: 'requestWithToken';
  payload: TokenRequestPayload<keyof Env, regular.Action['type']>;
};

const requestWithToken = <
  FuncName extends keyof Env,
  ACName extends regular.Action['type']
>(
  payload: TokenRequestPayload<FuncName, ACName>,
) => ({ type: 'requestWithToken', payload } as const);

export const creators = {
  requestWithToken,
};

const foo = requestWithToken<'fetchBuddies', 'fetchBuddiesCompleted'>({
  funcName: 'fetchBuddies' as const,
  funcArgs: [],
  actionCreatorName: 'fetchBuddiesCompleted' as const,
  actionCreatorArgs: [],
});

let a: Action;
a = foo;

const f = foo;
