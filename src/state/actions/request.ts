import * as actionType from '../../lib/action-type';
import * as authApi from '../../api/auth';

import { Env } from '../env';

import * as regular from './regular';

type UnpackPromise<T> = T extends PromiseLike<infer U> ? U : T;

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
      ? [
          [Fn, Parameters<ReturnType<Env[Fn]>>],
          [AC, Parameters<regular.Creators[AC]>],
        ]
      : never;
  };
};

export type Payload = TypeFilter[keyof Env][regular.Action['type']];

export function thunk(fnd: Payload[0], token: authApi.AccessToken, env: Env) {
  const argument = fnd[0][1];
  const argumentAny: any = argument;
  return async () => env[fnd[0]](token)(argumentAny);
}

export function createAction(
  payload: Payload,
  response: Responses,
): regular.Action {
  const ac = regular.creators[payload[1][0]];
  const argument = payload[1][1];
  const argumentAny: any = argument;
  const responseAny: any = response;
  return ac(argumentAny)(responseAny);
}

export type Responses = UnpackPromise<FinalReturn<Env[Payload[0][0]]>>;

const requestWithToken = (payload: Payload) =>
  ({ type: 'requestWithToken', payload } as const);

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export type Creators = typeof creators;
export const creators = {
  requestWithToken,
  requestCompleted: (index: number) => (response: Responses) =>
    ({ type: 'requestCompleted', payload: { index, response } } as const),
};
