export default function assertNever(value: never): never {
  throw new Error(`value {value} has reached assertNever`);
}
