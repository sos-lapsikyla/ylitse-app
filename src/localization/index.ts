// TODO get language from redux/somewhere
// Desing todo, how is default language chosen?
//
import isFinnishPhone from '../lib/isFinnishPhone';

import * as fi from './fi';
import * as en from './en';

import * as t from 'io-ts';
import { langCode } from '../api/feedback';
export type MessageId = fi.MessageId;

type Language = t.TypeOf<typeof langCode>;

export const lang: Language = isFinnishPhone ? 'fi' : 'en';

const messages = {
  fi: fi.messages,
  en: en.messages,
};
export const trans = (k: MessageId) => messages[lang][k];

export const blank: MessageId = 'meta.blank';
