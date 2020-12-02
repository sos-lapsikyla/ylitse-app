
declare global {
  namespace NodeJS {
    interface Global {
      XMLHttpRequest: any;
      originalXMLHttpRequest: any;
      FormData: any;
      originalFormData: any;
      Blob: any;
      originalBlob: any;
      originalFileReader: any;
      FileReader: any;
    } 
  }
}

// we must force tsc to interpret this file as a module, resolves
// "Augmentations for the global scope can only be directly nested in external modules or ambient module declarations."
// error
export {}
