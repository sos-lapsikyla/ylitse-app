import * as t from 'io-ts';
import * as RE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/pipeable';

import * as http from '../lib/http';
import * as err from '../lib/http-err';
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

export function fetchMessages(
  accessToken: authApi.AccessToken,
): RE.ObservableEither<err.Err, Record<string, Record<string, Message>>> {
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
  content: string;
};

export const sendMessage = (params: SendMessageParams) => (
  accessToken: authApi.AccessToken,
): RE.ObservableEither<err.Err, undefined> => {
  const url = `${config.baseUrl}/users/${accessToken.userId}/messages`;
  const message = {
    sender_id: accessToken.userId,
    recipient_id: params.buddyId,
    content: params.content,
    opened: false,
  };
  return pipe(
    http.post(url, message, {
      headers: authApi.authHeader(accessToken),
    }),
    RE.map(_ => undefined),
  );
};

type buddyId = string;
type messageId = string;
export type Thread = Record<messageId, Message>;
export type Threads = Record<buddyId, Thread>;
