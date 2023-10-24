import 'react-native-gesture-handler';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ReactRedux from 'react-redux';

import Screens from './Screens';
import * as state from './state';

const App: React.FC = () => (
  <SafeAreaProvider>
    <ReactRedux.Provider store={state.store}>
      <Screens />
    </ReactRedux.Provider>
  </SafeAreaProvider>
);

export default App;
