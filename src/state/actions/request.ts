import * as actionType from '../../lib/action-type';
import * as authApi from '../../api/auth';

import { Env } from '../env';

import * as regular from './regular';

export type UnpackPromise<T> = T extends PromiseLike<infer U> ? U : T;

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

export type TypeFilter = {
  [Fn in keyof Env]: {
    [AC in regular.Action['type']]: [
      UnpackPromise<FinalReturn<Env[Fn]>>,
    ] extends MiddleParameters<regular.Creators[AC]>
      ? {
          func: Fn;
          funcArgs: Parameters<ReturnType<Env[Fn]>>;
          actionCreator: AC;
          actionCreatorArgs: Parameters<regular.Creators[AC]>;
        }
      : never;
  };
};

export type Payload = TypeFilter[keyof Env][regular.Action['type']];

export function thunk(
  { func, funcArgs }: Payload,
  token: authApi.AccessToken,
  env: Env,
) {
  const argumentAny: any = funcArgs;
  return async () => env[func](token)(argumentAny);
}

export function createAction(
  { actionCreator, actionCreatorArgs }: Payload,
  response: Responses,
): regular.Action {
  const ac = regular.creators[actionCreator];
  const argumentAny: any = actionCreatorArgs;
  const responseAny: any = response;
  return ac(argumentAny)(responseAny);
}

export type Responses = UnpackPromise<FinalReturn<Env[Payload['func']]>>;

const requestWithToken = (payload: Payload) =>
  ({ type: 'requestWithToken', payload } as const);

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export type Creators = typeof creators;
export const creators = {
  requestWithToken,
  requestCompleted: (key: string) => (response: Responses) =>
    ({ type: 'requestCompleted', payload: { key, response } } as const),
};
