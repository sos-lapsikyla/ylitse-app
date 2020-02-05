import React from 'react';
import * as future from './future';
import * as remoteData from './remote-data';

type RequestState<Args> =
  | {
      type: 'waiting';
      args: Args;
    }
  | {
      type: 'idle';
    };

function useRemoteData<Args extends any[], Value, Err>(
  apiCall: future.Task<Args, Value, Err>,
): [
  remoteData.RemoteData<Value, Err>,
  (...args: Args) => void | undefined,
  () => void | undefined,
] {
  const [request, setRequest] = React.useState<RequestState<Args>>({
    type: 'idle',
  });
  const [state, setState] = React.useState<remoteData.RemoteData<Value, Err>>(
    remoteData.notAsked,
  );

  React.useEffect(() => {
    if (request.type === 'waiting' && !remoteData.isLoading(state)) {
      setState(remoteData.loading);
      (async () => {
        const newState = await apiCall(...request.args);
        if (request.type === 'waiting') {
          setState(newState);
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
      setState(remoteData.notAsked);
      setRequest({ type: 'idle' });
    },
  ];
}

export default useRemoteData;
