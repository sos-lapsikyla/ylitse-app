import * as fi from './fi';
import * as en from './fi';

export type MessageKey = fi.MessageKey & en.MessageKey;

type Language = 'fi' | 'en';

export const translator = (lang: Language) => {
  const messages = {
    fi: fi.messages,
    en: en.messages,
  };
  return (k: MessageKey) => messages[lang][k];
};
