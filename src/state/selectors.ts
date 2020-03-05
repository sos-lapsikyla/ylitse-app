import * as O from 'fp-ts/lib/Option';
import { getOptionM } from 'fp-ts/lib/OptionT';
import { getFoldableComposition } from 'fp-ts/lib/Foldable';
import * as record from 'fp-ts/lib/Record';
import * as A from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Tuple';
import * as F from 'fp-ts/lib/Functor';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constant, identity } from 'fp-ts/lib/function';

import * as err from '../lib/http-err';
import * as remoteData from '../lib/remote-data';
import * as mentorsApi from '../api/mentors';
import * as taggedUnion from '../lib/tagged-union';
import * as array from '../lib/array';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';
import * as authApi from '../api/auth';

import * as localization from '../localization';

import { AppState } from './model';

export function getMentors(
  mentors: RD.RemoteData<err.Err, Record<string, mentorsApi.Mentor>>,
): RD.RemoteData<err.Err, mentorApi.Mentor[]> {
  const entries = RD.remoteData.map(mentors, record.toArray);
  const RDA = F.getFunctorComposition(RD.remoteData, A.array);
  return RDA.map(entries, T.snd);
}

export const getAccessToken = (state: AppState) =>
  pipe(
    state,
    ({ accessToken }: AppState) => accessToken,
    O.map(({ currentToken }) => currentToken),
  );

export const getAC = flow(
  getAccessToken,
  O.getOrElse(constant(authApi.invalidToken)),
);

export const getBuddyName = (
  buddyId: string,
  buddyState: AppState['buddies'],
  mentorState: AppState['mentors'],
) => {
  const RDO = getOptionM(RD.remoteData);
  const look = (rd: RD.RemoteData<unknown, Record<string, { name: string }>>) =>
    RD.remoteData.map(rd, r => record.lookup(buddyId, r));
  const buddy = RDO.alt(look(buddyState), () => look(mentorState));
  return getFoldableComposition(RD.remoteData, O.option).reduce(
    buddy,
    '',
    (_, { name }) => name,
  );
};

export function getChatList(buddies: AppState['buddies']) {
  return remoteData.map(fromPollable(buddies), array.fromNonTotalRecord);
}

const getDate = (n: number) => {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const localize = localization.translator('fi');

  const months: { [n: number]: string } = {
    0: localize('date.month.01'),
    1: localize('date.month.02'),
    2: localize('date.month.03'),
    3: localize('date.month.04'),
    4: localize('date.month.05'),
    5: localize('date.month.06'),
    6: localize('date.month.07'),
    7: localize('date.month.08'),
    8: localize('date.month.09'),
    9: localize('date.month.10'),
    10: localize('date.month.11'),
    11: localize('date.month.12'),
  };

  return `${day}. ${months[month]} ${year} `;
};

export type Message =
  | { type: 'Message'; value: messageApi.Message; id: string }
  | { type: 'Date'; value: string; id: string };

export function getMessages(
  messageState: AppState['messages'],
  buddyId: string,
): Message[] {
  const messageList = taggedUnion.match<
    AppState['messages'],
    messageApi.Message[]
  >(messageState, {
    Ok: ({ value: [messages] }) => {
      const messagesById = messages[buddyId];
      if (messagesById === undefined) return [];
      return array
        .fromNonTotalRecord(messagesById)
        .sort(({ sentTime: A }, { sentTime: B }) => A - B);
    },
    default: [],
  });
  return messageList
    .reduce((acc: Message[], m) => {
      const last = acc[acc.length - 1];
      const next = { type: 'Message' as const, value: m, id: m.messageId };
      const date = getDate(next.value.sentTime);
      const nextDate = { type: 'Date' as const, value: date, id: date };
      if (
        !!last &&
        last.type === 'Message' &&
        getDate(last.value.sentTime) === date
      ) {
        acc.push(next);
        return acc;
      }
      acc.push(nextDate);
      acc.push(next);
      return acc;
    }, [])
    .reverse();
}
