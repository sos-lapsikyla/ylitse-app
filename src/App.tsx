import 'react-native-gesture-handler';

import React from 'react';
import RN from 'react-native';
import * as ReactRedux from 'react-redux';

import Screens from './Screens';
import * as state from './state';

const App: React.FC = () => (
  <RN.View style={styles.root}>
    <ReactRedux.Provider store={state.store}>
      <Screens />
    </ReactRedux.Provider>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  root: { flex: 1 },
});

export default App;
