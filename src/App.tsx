import 'react-native-gesture-handler';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ReactRedux from 'react-redux';
import RN from 'react-native';

import Screens from './Screens';
import * as state from './state';

const App: React.FC = () => (
  <SafeAreaProvider style={styles.screen}>
    <ReactRedux.Provider store={state.store}>
      <Screens />
    </ReactRedux.Provider>
  </SafeAreaProvider>
);

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default App;
