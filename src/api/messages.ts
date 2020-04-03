import * as t from 'io-ts';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import * as http from '../lib/http';
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

export const markSeen = (message: Message) => (token: authApi.AccessToken) => {
  const url = `${config.baseUrl}/users/${token.userId}/messages/${message.messageId}`;
  const seenMessage = messageType.encode(toApiMessage(token.userId, message));
  return http.validateResponse(
    http.put(url, seenMessage, {
      headers: authApi.authHeader(token),
    }),
    t.unknown,
    _ => true,
  );
};

const messageListType = t.strict({ resources: t.array(messageType) });

const toApiMessage: (userId: string, a: Message) => ApiMessage = (
  userId,
  { buddyId, messageId, type, content, isSeen, sentTime },
) => ({
  content,
  recipient_id: type === 'Sent' ? buddyId : userId,
  sender_id: type === 'Sent' ? userId : buddyId,
  id: messageId,
  created: sentTime,
  opened: isSeen,
});

export type Message = {
  buddyId: string;
  messageId: string;

  type: 'Sent' | 'Received';
  content: string;
  sentTime: number;
  isSeen: boolean;
};

const toMessage: (
  a: string,
) => (b: ApiMessage) => Message = userId => apiMessage => {
  const isSent = userId === apiMessage.sender_id;
  return {
    type: isSent ? 'Sent' : 'Received',
    buddyId: isSent ? apiMessage.recipient_id : apiMessage.sender_id,
    isSeen: apiMessage.opened,
    content: apiMessage.content,
    sentTime: apiMessage.created,
    messageId: apiMessage.id,
  };
};

export function fetchMessages(
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, Record<string, Record<string, Message>>> {
  return http.validateResponse(
    http.get(`${config.baseUrl}/users/${accessToken.userId}/messages`, {
      headers: authApi.authHeader(accessToken),
    }),
    messageListType,
    ({ resources }) =>
      resources.map(toMessage(accessToken.userId)).reduce(
        (acc: Record<string, Record<string, Message>>, message: Message) => ({
          ...acc,
          [message.buddyId]: {
            ...acc[message.buddyId],
            [message.messageId]: message,
          },
        }),
        {},
      ),
  );
}

export type SendMessageParams = {
  buddyId: string;
  text: string;
};

export const sendMessage = (params: SendMessageParams) => (
  accessToken: authApi.AccessToken,
): TE.TaskEither<string, undefined> => {
  const url = `${config.baseUrl}/users/${accessToken.userId}/messages`;
  const message = {
    sender_id: accessToken.userId,
    recipient_id: params.buddyId,
    content: params.text,
    opened: false,
  };
  return pipe(
    http.post(url, message, {
      headers: authApi.authHeader(accessToken),
    }),
    TE.map(_ => undefined),
  );
};

type buddyId = string;
type messageId = string;
export type Thread = Record<messageId, Message>;
export type Threads = Record<buddyId, Thread>;
