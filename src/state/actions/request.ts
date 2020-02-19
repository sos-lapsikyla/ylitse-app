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

type TokenRequestPayload<
  FuncName extends keyof Env,
  ACName extends regular.Action['type']
> = {
  funcName: FuncName;
  funcArgs: Parameters<ReturnType<Env[FuncName]>>;

  actionCreatorName: [FinalReturn<Env[FuncName]>] extends MiddleParameters<
    regular.Creators[ACName]
  >
    ? ACName
    : number;
  actionCreatorArgs: Parameters<regular.Creators[ACName]>;
};

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export const creators = {
  requestWithToken: <
    FuncName extends keyof Env,
    ACName extends regular.Action['type']
  >(
    payload: TokenRequestPayload<FuncName, ACName>,
  ) => ({ type: 'requestWithToken', payload } as const),
};
