import 'react-native-gesture-handler';

import React from 'react';
import RN from 'react-native';

import Screens from './Screens';

const App: React.FC = () => (
  <RN.View style={styles.root}>
    <Screens />
  </RN.View>
);

const styles = RN.StyleSheet.create({
  root: { flex: 1 },
});

export default App;
