import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import * as localization from '../../../../localization';

import { getMessagesByBuddyId } from '../../../../state/reducers/messages';

import * as messageApi from '../../../../api/messages';

import Message, { MessageProps } from './Message';
import DateBubble, { DateBubbleProps } from './DateBubble';

type Props = { buddyId: string };

const getDate = (n: number) => {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const months: { [n: number]: string } = {
    0: localization.trans('date.month.01'),
    1: localization.trans('date.month.02'),
    2: localization.trans('date.month.03'),
    3: localization.trans('date.month.04'),
    4: localization.trans('date.month.05'),
    5: localization.trans('date.month.06'),
    6: localization.trans('date.month.07'),
    7: localization.trans('date.month.08'),
    8: localization.trans('date.month.09'),
    9: localization.trans('date.month.10'),
    10: localization.trans('date.month.11'),
    11: localization.trans('date.month.12'),
  };

  return `${day}. ${months[month]} ${year} `;
};

export type Renderable = MessageProps | DateBubbleProps;

export function toRenderable(messages: messageApi.Message[]): Renderable[] {
  return messages
    .reduce((acc: Renderable[], m) => {
      const last = acc[acc.length - 1];
      const next = {
        type: 'Message' as const,
        value: m,
        id: m.messageId,
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

function renderItem({ item }: { item: Renderable }) {
  if (item.type === 'Message') {
    return <Message {...item} />;
  } else {
    return <DateBubble {...item} />;
  }
}

export default ({ buddyId }: Props) => {
  const messageList = useSelector(getMessagesByBuddyId(buddyId));
  messageList.sort(({ sentTime: A }, { sentTime: B }) => A - B);
  const messages = toRenderable(messageList);
  return (
    <RN.FlatList
      contentContainerStyle={styles.scrollContent}
      data={messages}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      inverted={true}
    />
  );
};

const styles = RN.StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
});
