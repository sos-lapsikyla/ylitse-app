import * as t from 'io-ts';

export type Err = UnkownError | BadStatus | BadModel | UnkownReason;
export type UnkownError = {
  readonly type: 'UnkownError';
  reason?: string;
};
export type BadStatus = {
  readonly type: 'BadStatus';
  readonly status: number;
};
export type BadModel = {
  readonly type: 'BadModel';
  readonly errors: t.Errors;
};
export type UnkownReason = {
  readonly type: 'ReasonError';
  readonly reason: unknown;
};

export function reasonError(reason: unknown): Err {
  return { type: 'ReasonError', reason } as const;
}

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
