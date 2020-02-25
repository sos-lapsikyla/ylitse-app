import * as option from 'fp-ts/lib/Option';
import * as tuple from 'fp-ts/lib/Tuple';
import { pipe } from 'fp-ts/lib/pipeable';

import * as remoteData from '../lib/remote-data';
// import * as tuple from '../lib/tuple';
import * as http from '../lib/http';
import * as taggedUnion from '../lib/tagged-union';
import * as array from '../lib/array';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';

import * as localization from '../localization';

import { AppState, Pollable } from './model';

export function getMentors(
  mentors: AppState['mentors'],
): remoteData.RemoteData<mentorApi.Mentor[], http.Err> {
  return remoteData.map(mentors, array.fromNonTotalRecord);
}

export const getAccessToken = (state: AppState) =>
  pipe(
    state,
    ({ accessToken }: AppState) => accessToken,
    option.map(tuple.fst),
  );

export const fromPollable = <A>(data: Pollable<A>) =>
  remoteData.map(data, tuple.fst);

export const getBuddyName = (
  buddyId: string,
  buddyState: AppState['buddies'],
  mentorState: AppState['mentors'],
) => {
  const buddies = fromPollable(buddyState);
  if (buddies.type === 'Ok') {
    const buddy = buddies.value[buddyId];
    if (buddy) return buddy.name;
  }
  const mentors = mentorState;
  if (mentors.type === 'Ok') {
    const buddy = mentors.value[buddyId];
    if (buddy) return buddy.name;
  }
  return '';
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
