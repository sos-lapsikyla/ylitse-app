export type Timestamped = {
  timestamp: number;
};

// Async communicates that this is a side-effectfull thing.
export async function timestamp(): Promise<Timestamped> {
  return Promise.resolve({ timestamp: Date.now() });
}

export function delay<A>(
  millis: number,
  p: () => Promise<A>,
): () => Promise<A> {
  return () =>
    new Promise(resolve => {
      setTimeout(() => {
        p().then(resolve);
      }, millis);
    });
}

export const tick = delay(1000, timestamp);
