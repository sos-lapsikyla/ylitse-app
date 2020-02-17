import * as retryable from '../lib/remote-data-retryable';
import * as remoteData from '../lib/remote-data';
import * as option from '../lib/option';
import * as tuple from '../lib/tuple';
import * as http from '../lib/http';

import * as messageApi from '../api/messages';

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

export const getMentors = ({ mentors }: AppState) => mentors;
export const getAccessToken = ({ accessToken }: AppState) =>
  option.map(accessToken, tuple.fst);

export const fromRetryable = <A, E>(
  data: retryable.Retryable<
    [A, Exclude<retryable.Retryable<unknown, E>, remoteData.Ok<unknown>>],
    E
  >,
) => remoteData.map(retryable.toRemoteData(data), tuple.fst);

export const getThreads: (
  state: AppState,
) => remoteData.RemoteData<Thread[], http.Err> = state => {
  const both = remoteData.append(
    fromRetryable(state.messages),
    fromRetryable(state.buddies),
  );
  return remoteData.map(both, ([messages, buddies]) =>
    buddies.map(({ name, userId }) => {
      let threadMessages: messageApi.Message[] = [];
      for (const message of Object.values(messages[userId] || {})) {
        if (message !== undefined) {
          threadMessages.push(message);
        }
      }
      threadMessages.sort(({ sentTime: a }, { sentTime: b }) => a - b);
      return {
        name,
        buddyId: userId,
        messages: threadMessages,
      };
    }),
  );
};

export type Thread = {
  name: string;
  buddyId: string;
  messages: messageApi.Message[];
};
