// TODO get language from redux/somewhere
// Desing todo, how is default language chosen?
//

import * as fi from './fi';
import * as en from './en';
import * as ar from './ar';
import systemLanguage from '../lib/systemLanguage';
export type MessageId = fi.MessageId;

const messages = {
  fi: fi.messages,
  en: en.messages,
  ar: ar.messages,
};
export const trans = (k: MessageId) => messages[systemLanguage][k];

export const blank: MessageId = 'meta.blank';
