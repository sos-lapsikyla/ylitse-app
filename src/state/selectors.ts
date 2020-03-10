import * as O from 'fp-ts/lib/Option';
import { getOptionM } from 'fp-ts/lib/OptionT';
import { getFoldableComposition } from 'fp-ts/lib/Foldable';
import * as record from 'fp-ts/lib/Record';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constant } from 'fp-ts/lib/function';

import * as err from '../lib/http-err';
import * as mentorsApi from '../api/mentors';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';
import * as buddyApi from '../api/buddies';
import * as authApi from '../api/auth';

import * as localization from '../localization';

import { AppState } from './model';

export function getMentors(
  mentors: RD.RemoteData<err.Err, Record<string, mentorsApi.Mentor>>,
): RD.RemoteData<err.Err, mentorApi.Mentor[]> {
  return RD.remoteData.map(mentors, Object.values);
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
  const look = (fa: RD.RemoteData<unknown, Record<string, { name: string }>>) =>
    RD.remoteData.map(fa, a => record.lookup(buddyId, a));
  const buddy = getOptionM(RD.remoteData).alt(look(buddyState), () =>
    look(mentorState),
  );
  return getFoldableComposition(RD.remoteData, O.option).reduce(
    buddy,
    '',
    (_, { name }) => name,
  );
};

export function getChatList(
  buddies: AppState['buddies'],
): RD.RemoteData<err.Err, buddyApi.Buddy[]> {
  return RD.remoteData.map(buddies, Object.values);
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
  const messagesById = RD.remoteData.map(messageState, r =>
    record.lookup(buddyId, r),
  );
  const messageList: messageApi.Message[] = getFoldableComposition(
    RD.remoteData,
    O.option,
  ).reduce(messagesById, [], r =>
    Object.values(r).sort(({ sentTime: A }, { sentTime: B }) => A - B),
  );
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
