import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';

// represents a unix time from an ISO string
export const unixTimeFromDateString = new t.Type<number, string, unknown>(
  'UnixTimeFromDateString',
  (u): u is number => typeof u === 'number',
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      const n = new Date(s).getTime();

      return isNaN(n) ? t.failure(u, c) : t.success(n);
    }),
  a => new Date(a).toISOString(),
);

const isValidEmail = (value: string): boolean => {
  if (value === '') {
    return true;
  }

  if (value.length > 320) {
    return false;
  }

  return /^[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]{1,64}@[a-z0-9.-]+\.[a-z]{2,64}$/.test(
    value,
  );
};

export const isValidName = (value: string): boolean => {
  if (value === '') {
    return false;
  }

  if (value.length > 35) {
    return false;
  }

  return /^[\u00C0-\u017FA-zA-Z'0-9-_]{3,35}$/.test(value);
};

export const isValidDescription = (value: string): boolean => {
  if (value === '') {
    return false;
  }

  return /(.*?)/.test(value);
};

export const ValidEmail = new t.Type<string, string, unknown>(
  'ValidEmail',
  (input: unknown): input is string => typeof input === 'string',
  (input, context) =>
    typeof input === 'string' && isValidEmail(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const ValidName = new t.Type<string, string, unknown>(
  'ValidName',
  (input: unknown): input is string => typeof input === 'string',
  (input, context) =>
    typeof input === 'string' && isValidName(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);

export const ValidDescription = new t.Type<string, string, unknown>(
  'ValidDescription',
  (input: unknown): input is string => typeof input === 'string',
  (input, context) =>
    typeof input === 'string' && isValidDescription(input)
      ? t.success(input)
      : t.failure(input, context),
  t.identity,
);
