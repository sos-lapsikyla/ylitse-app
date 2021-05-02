import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';

// represents a unix time from an ISO string
export const unixTimeFromDateString = new t.Type<number, string, unknown>(
  'UnixTimeFromDateString',
  (u): u is number => typeof u === 'number',
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      let datetimeString = s;

      // datetime strings from API dont include timezone information
      // patch it so that it would at least have the Z at the end.
      // If this situation changes some day. this code should detect
      // if timezone info is already there.
      // At the time of writing. Android only supports Z and +/-hh:mm formats,
      // so only check those.

      const len = datetimeString.length;
      const endsWithZone =
        datetimeString.slice(-1).toUpperCase() === 'Z' || // ends with Z
        ['+', '-'].includes(datetimeString.slice(len - 6, len - 5)); // +/-hh:mm

      if (!endsWithZone) {
        datetimeString = `${datetimeString}Z`;
      }
      const n = new Date(datetimeString).getTime();
      return isNaN(n) ? t.failure(u, c) : t.success(n);
    }),
  a => new Date(a).toISOString(),
);
