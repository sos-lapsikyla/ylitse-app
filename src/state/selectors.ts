import * as remoteData from '../lib/remote-data';
import * as option from '../lib/option';
import * as tuple from '../lib/tuple';
import * as http from '../lib/http';
import * as taggedUnion from '../lib/tagged-union';
import * as array from '../lib/array';

import * as messageApi from '../api/messages';
import * as mentorApi from '../api/mentors';

import { AppState, Pollable } from './model';

export function getMentors(
  mentors: AppState['mentors'],
): remoteData.RemoteData<mentorApi.Mentor[], http.Err> {
  return remoteData.map(mentors, array.fromNonTotalRecord);
}

export const getAccessToken = ({ accessToken }: AppState) =>
  option.map(accessToken, tuple.fst);

export const fromPollable = <A>(data: Pollable<A>) =>
  remoteData.map(data, tuple.fst);

export const getBuddyName = (
  buddyId: string,
  buddyState: AppState['buddies'],
  mentorState: AppState['mentors'],
) => {
  const both = remoteData.append(fromPollable(buddyState), mentorState);
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
  return remoteData.map(fromPollable(buddies), array.fromNonTotalRecord);
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
