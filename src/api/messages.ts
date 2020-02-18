import * as t from 'io-ts';

import * as http from '../lib/http';
import * as result from '../lib/result';
import * as future from '../lib/future';
import * as validators from '../lib/validators';

import * as authApi from './auth';
import * as config from './config';

type ApiMessage = t.TypeOf<typeof messageType>;
const messageType = t.interface({
  content: t.string,
  recipient_id: t.string,
  sender_id: t.string,
  created: validators.unixTimeFromDateString,
  opened: t.boolean,
  id: t.string,
});

const messageListType = t.strict({ resources: t.array(messageType) });

export type Message = {
  type: 'Sent' | 'Received';
  content: string;
  sentTime: number;
  buddyId: string;
  seen: boolean;
  messageId: string;
};

const toMessage: (
  a: string,
) => (b: ApiMessage) => Message = userId => apiMessage => {
  const isSent = userId === apiMessage.sender_id;
  return {
    type: isSent ? 'Sent' : 'Received',
    buddyId: isSent ? apiMessage.recipient_id : apiMessage.sender_id,
    seen: !apiMessage.opened,
    content: apiMessage.content,
    sentTime: apiMessage.created,
    messageId: apiMessage.id,
  };
};

export async function fetchMessages(
  accessToken: authApi.AccessToken,
): future.Future<Threads, http.Err> {
  const url = `${config.baseUrl}/users/${accessToken.userId}/messages`;
  const response = await http.get(url, messageListType, {
    headers: authApi.authHeader(accessToken),
  });
  if (response.type === 'Err') return response;
  const messages = response.value.resources.map(toMessage(accessToken.userId));
  const threads = messages.reduce(
    (acc: Threads, message: Message) => ({
      ...acc,
      [message.buddyId]: {
        ...acc[message.buddyId],
        [message.messageId]: message,
      },
    }),
    {},
  );
  return result.ok(threads);
}

export type SendMessageParams = {
  buddyId: string;
  content: string;
};

export async function sendMessage(
  accessToken: authApi.AccessToken,
  params: SendMessageParams,
) {
  const url = `${config.baseUrl}/users/${accessToken.userId}/messages`;
  const message = {
    sender_id: accessToken.userId,
    recipient_id: params.buddyId,
    content: params.content,
    opened: false,
  };
  const response = await http.post(url, message, t.unknown);
  return result.map(response, _ => undefined);
}

export type Threads = Partial<{
  [buddyId: string]: Thread;
}>;
export type Thread = Partial<{ [messageId: string]: Message }>;
