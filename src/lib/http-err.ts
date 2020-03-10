import * as t from 'io-ts';

export type Err = UnkownError | BadStatus | BadModel;
export type UnkownError = {
  readonly type: 'UnkownError';
};
export type BadStatus = {
  readonly type: 'BadStatus';
  readonly status: number;
};
export type BadModel = {
  readonly type: 'BadModel';
  readonly errors: t.Errors;
};

export function unknownError(): Err {
  return { type: 'UnkownError' } as const;
}
export function badStatus(status: number): Err {
  return { type: 'BadStatus', status } as const;
}
export function badModel(errors: t.Errors): Err {
  return { type: 'BadModel', errors } as const;
}

export function is401(err: Err): boolean {
  return err.type === 'BadStatus' && err.status === 401;
}
