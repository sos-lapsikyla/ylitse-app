import React from 'react';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RD from '@devexperts/remote-data-ts';

type RequestState<Args> =
  | {
      type: 'waiting';
      args: Args;
    }
  | {
      type: 'idle';
    };

function useRemoteData<Args extends any[], Err, Value>(
  apiCall: (...argrs: Args) => TE.TaskEither<Err, Value>,
): [
  RD.RemoteData<Err, Value>,
  (...args: Args) => void | undefined,
  () => void | undefined,
] {
  const [request, setRequest] = React.useState<RequestState<Args>>({
    type: 'idle',
  });
  const [state, setState] = React.useState<RD.RemoteData<Err, Value>>(
    RD.initial,
  );

  React.useEffect(() => {
    if (request.type === 'waiting' && !RD.isPending(state)) {
      setState(RD.pending);
      (async () => {
        const newState = await apiCall(...request.args)();
        if (request.type === 'waiting') {
          setState(RD.fromEither(newState));
          setRequest({ type: 'idle' });
        }
      })();
    }
  }, [request.type]);
  return [
    state,
    (...args: Args) => {
      if (request.type === 'idle') setRequest({ type: 'waiting', args });
    },
    () => {
      setState(RD.initial);
      setRequest({ type: 'idle' });
    },
  ];
}

export default useRemoteData;
