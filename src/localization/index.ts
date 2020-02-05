// TODO get language from redux/somewhere
// Desing todo, how is default language chosen?

import * as fi from './fi';
import * as en from './fi';

export type MessageId = fi.MessageId;

type Language = 'fi' | 'en';

export const translator = (lang: Language) => {
  const messages = {
    fi: fi.messages,
    en: en.messages,
  };
  return (k: MessageId) => messages[lang][k];
};
