declare const window: {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
    ...fs: Function[]
  ) => (...args: any[]) => any;
  __FETCH_SUPPORT__?: {
    blob: any;
  };
};

declare const global: {
  XMLHttpRequest: any;
  originalXMLHttpRequest: any;
  FormData: any;
  originalFormData: any;
  Blob: any;
  originalBlob: any;
  originalFileReader: any;
  FileReader: any;
};
