import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as option from '../lib/option';
import * as tuple from '../lib/tuple';
import * as http from '../lib/http';
import * as taggedUnion from '../lib/tagged-union';
import * as array from '../lib/array';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';

import * as accessTokenState from './accessToken';
import * as buddiesState from './buddies';
import * as scheduler from './scheduler';
import * as mentorsState from './mentors';
import * as messagesState from './messages';

export type AppState = {
  scheduler: scheduler.State;

  accessToken: accessTokenState.State;
  buddies: buddiesState.State;
  mentors: mentorsState.State;
  messages: messagesState.State;
};

export function getMentors(
  mentors: AppState['mentors'],
): remoteData.RemoteData<mentorApi.Mentor[], http.Err> {
  return remoteData.map(mentors, array.fromNonTotalRecord);
}

export const getAccessToken = ({ accessToken }: AppState) =>
  option.map(accessToken, tuple.fst);

export const fromRetryable = <A, E>(
  data: retryable.Retryable<
    [A, Exclude<retryable.Retryable<unknown, E>, remoteData.Ok<unknown>>],
    E
  >,
) => remoteData.map(retryable.toRemoteData(data), tuple.fst);

export const getBuddyName = (
  buddyId: string,
  buddyState: buddiesState.State,
  mentorState: mentorsState.State,
) => {
  const both = remoteData.append(fromRetryable(buddyState), mentorState);
  return taggedUnion.match(both, {
    default: '',
    Ok: ({ value: [buddies, mentors] }) => {
      const buddy = buddies[buddyId];
      if (buddy) return buddy.name;
      const mentor = mentors[buddyId];
      if (mentor) return mentor.name;
      return '';
    },
  });
};

export function getChatList(buddies: AppState['buddies']) {
  return remoteData.map(fromRetryable(buddies), array.fromNonTotalRecord);
}

export function getMessages(
  messageState: AppState['messages'],
  buddyId: string,
) {
  return taggedUnion.match<AppState['messages'], messageApi.Message[]>(
    messageState,
    {
      Ok: ({ value: [messages] }) => {
        const messagesById = messages[buddyId];
        if (messagesById === undefined) return [];
        return array.fromNonTotalRecord(messagesById);
      },
      default: [],
    },
  );
}
