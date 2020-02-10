export const identity: <A>(a: A) => A = a => a;

// Used for exhaustiveness checking
export default function assertNever(value: never): never {
  throw new Error(`value ${value} has reached assertNever`);
}
