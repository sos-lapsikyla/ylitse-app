import * as record from './record';

export function fromNonTotalRecord<A>(nonTotal: record.NonTotal<A>): A[] {
  let array: A[] = [];
  for (const key in nonTotal) {
    const value = nonTotal[key];
    if (value !== undefined) {
      array.push(value);
    }
  }
  return array;
}
