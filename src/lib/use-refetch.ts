import React from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/** 
 Hook for triggering a refetch
 when app comes from background or
 the screen has been focused
 **/

type Params = {
  callback: () => void;
};

export const useRefetch = ({ callback }: Params) => {
  const appState = React.useRef(AppState.currentState);
  useFocusEffect(
    React.useCallback(() => {
      callback();
    }, []),
  );

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        switch (appState.current) {
          case 'inactive':
          case 'background':
            callback();
            break;
          default:
            break;
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
