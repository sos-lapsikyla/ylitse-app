import React from 'react';
import RN from 'react-native';
import { useDispatch } from 'react-redux';

import * as localization from '../../../../localization';

import { markSeen } from '../../../../state/reducers/markSeen';
import * as messageApi from '../../../../api/messages';

import { MessageProps } from './Message';
import { DateBubbleProps } from './DateBubble';
import { MemoizedRenderItem } from './MemoizedRenderItem';

type Props = {
  messageList: Array<messageApi.Message>;
  getPreviousMessages: (previousMsgId: string) => void;
  isLoading: boolean;
};

type LoadingProps = { type: 'Loading'; id: string };

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

export type Renderable = LoadingProps | MessageProps | DateBubbleProps;

export function toRenderable(
  messages: messageApi.Message[],
  isLoading: boolean,
): Renderable[] {
  const messageList = messages
    .reduce((acc: Renderable[], m) => {
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

  return isLoading
    ? [...messageList, { type: 'Loading', id: 'Loading' }]
    : messageList;
}

export const MessageList = ({
  messageList,
  getPreviousMessages,
  isLoading,
}: Props) => {
  const messages = toRenderable(messageList, isLoading);
  const previousItem = messageList.length > 0 ? messageList[0].messageId : '0';
  const dispatch = useDispatch();

  const getPreviousMessagesIfNotLoading = () => {
    if (isLoading) {
      return;
    }

    getPreviousMessages(previousItem);
  };

  type ViewArgs = {
    viewableItems: Array<RN.ViewToken>;
    changed: Array<RN.ViewToken>;
  };

  const handleViewableChanged = ({ changed }: ViewArgs) => {
    // TODO: Helper here, decode the changed maybe
    const unSeenMessagesOnScreen = changed
      .filter(item => item.isViewable)
      .filter(
        ({ item }) =>
          !item.isSeen && item.value && item.value.type === 'Received',
      )
      .map<messageApi.Message>(({ item }) => item.value);

    dispatch(markSeen({ messages: unSeenMessagesOnScreen }));
  };

  const viewabilityConfig: RN.ViewabilityConfig = {
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 1000,
  };

  const viewabilityConfigCallbackPairs = React.useRef([
    { viewabilityConfig, onViewableItemsChanged: handleViewableChanged },
  ]);

  return (
    <RN.FlatList
      contentContainerStyle={styles.scrollContent}
      data={messages}
      renderItem={({ item }) => <MemoizedRenderItem item={item} />}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      keyExtractor={item => item.id}
      inverted={true}
      onEndReachedThreshold={0.01}
      onEndReached={getPreviousMessagesIfNotLoading}
    />
  );
};

const styles = RN.StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
});
