import 'react-native-gesture-handler';

import React from 'react';
import RN from 'react-native';
import * as ReactRedux from 'react-redux';

import Screens from './Screens';
import * as state from './state';

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  // https://github.com/react-navigation/react-navigation/issues/7839
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  // https://github.com/facebook/react-native/issues/16376
  'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks',
  // https://stackoverflow.com/questions/69538962/new-nativeeventemitter-was-called-with-a-non-null-argument-without-the-requir
  // https://github.com/facebook/react-native/issues/32037
  // https://github.com/react-navigation/react-navigation/issues/9882
  "EventEmitter.removeListener('change', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.",
  '`new NativeEventEmitter()`',
]);

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

global.XMLHttpRequest = global.originalXMLHttpRequest
  ? global.originalXMLHttpRequest
  : global.XMLHttpRequest;
global.FormData = global.originalFormData
  ? global.originalFormData
  : global.FormData;

fetch; // Ensure to get the lazy property

if (window.__FETCH_SUPPORT__) {
  // it's RNDebugger only to have
  window.__FETCH_SUPPORT__.blob = false;
} else {
  /*
   * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
   * If you're using another way you can just use the native Blob and remove the `else` statement
   */
  global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
  global.FileReader = global.originalFileReader
    ? global.originalFileReader
    : global.FileReader;
}

export default App;
