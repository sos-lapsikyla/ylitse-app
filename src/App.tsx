import 'react-native-gesture-handler';
import * as redux from 'redux';
import * as reduxLoop from 'redux-loop';

import React from 'react';
import RN from 'react-native';
import * as ReactRedux from 'react-redux';

import Screens from './Screens';
import * as state from './state';

const createStore = redux.createStore as ((
  reducer: (
    state: state.State,
    action: state.Action,
  ) => state.State | reduxLoop.Loop<state.State, state.Action>,
  initialState: state.State,
  enhancer: redux.StoreEnhancer,
) => redux.Store<state.State, state.Action>);

export const store: redux.Store<state.State, state.Action> = createStore(
  state.reducer,
  state.initialState,
  reduxLoop.install({ DONT_LOG_ERRORS_ON_HANDLED_FAILURES: true }),
);

const App: React.FC = () => (
  <RN.View style={styles.root}>
    <ReactRedux.Provider store={store}>
      <Screens />
    </ReactRedux.Provider>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  root: { flex: 1 },
});

export default App;
