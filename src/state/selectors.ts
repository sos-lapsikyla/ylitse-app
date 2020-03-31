import * as O from 'fp-ts/lib/Option';
import { getOptionM } from 'fp-ts/lib/OptionT';
import { getFoldableComposition } from 'fp-ts/lib/Foldable';
import * as record from 'fp-ts/lib/Record';
import * as array from 'fp-ts/lib/Array';
import { monoidAny } from 'fp-ts/lib/Monoid';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow, constant } from 'fp-ts/lib/function';

import * as mentorsApi from '../api/mentors';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';
import * as buddyApi from '../api/buddies';
import * as authApi from '../api/auth';

import * as localization from '../localization';

import { AppState } from './model';

export function getMentors(
  mentors: RD.RemoteData<string, Record<string, mentorsApi.Mentor>>,
): RD.RemoteData<string, mentorApi.Mentor[]> {
  return RD.remoteData.map(mentors, Object.values);
}

export const getAccessToken = ({ accessToken }: AppState) =>
  accessToken.currentToken;

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
  | { type: 'Message'; value: messageApi.Message; id: string; isSeen: boolean }
  | { type: 'Date'; value: string; id: string };

const messageList = (messageState: AppState['messages'], buddyId: string) => {
  const messagesById = RD.remoteData.map(messageState, r =>
    record.lookup(buddyId, r),
  );
  return getFoldableComposition(RD.remoteData, O.option).reduce<
    string,
    Record<string, messageApi.Message>,
    messageApi.Message[]
  >(messagesById, [], (_, messages) =>
    Object.values(messages).sort(({ sentTime: A }, { sentTime: B }) => A - B),
  );
};

export function getMessages(
  messageState: AppState['messages'],
  buddyId: string,
): Message[] {
  return messageList(messageState, buddyId)
    .reduce((acc: Message[], m) => {
      const last = acc[acc.length - 1];
      const next = {
        type: 'Message' as const,
        value: m,
        id: m.messageId,
        isSeen: m.isSeen,
      };
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

export type Buddy = buddyApi.Buddy & { hasNewMessages: boolean };

export function getChatList(
  buddies: AppState['buddies'],
  messageState: AppState['messages'],
): RD.RemoteData<string, Buddy[]> {
  return pipe(
    buddies,
    RD.map(
      record.mapWithIndex((buddyId, buddy) => ({
        ...buddy,
        hasNewMessages: pipe(
          messageList(messageState, buddyId),
          array.filter(message => message.type === 'Received'),
          array.foldMap(monoidAny)(({ isSeen }) => !isSeen),
        ),
      })),
    ),
    RD.map(Object.values),
  );
}

export const isAnyMessageUnseen = ({ messages: messageState }: AppState) =>
  getFoldableComposition(RD.remoteData, record.record).foldMap(monoidAny)(
    messageState,
    record.some(({ isSeen }) => !isSeen),
  );

export const getMessage = (
  { messages: messageState }: AppState,
  index: {
    buddyId: string;
    messageId: string;
  },
) => {
  return pipe(
    RD.toOption(messageState),
    O.chain(threads => record.lookup(index.buddyId, threads)),
    O.chain(threadMessages => record.lookup(index.messageId, threadMessages)),
  );
};
