import 'react-native-gesture-handler';

import React from 'react';
import RN from 'react-native';

const App: React.FC = () => <RN.View style={styles.root}></RN.View>;

const styles = RN.StyleSheet.create({
  root: { flex: 1 },
});

export default App;
