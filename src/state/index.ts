import * as automaton from 'redux-automaton';
import * as reduxObservable from 'redux-observable';
import * as redux from 'redux';

import * as model from './model';
import * as actions from './actions';
import * as reducers from './reducers';

import rootEpic from './epics';

export type AppState = model.AppState;

const epicMiddleware = reduxObservable.createEpicMiddleware<
  actions.Action,
  actions.Action,
  AppState
>();
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const enhancer = compose(redux.applyMiddleware(epicMiddleware));

export const store = automaton.createStore(
  reducers.rootReducer,
  reducers.initialState,
  enhancer,
);
epicMiddleware.run(rootEpic);

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
