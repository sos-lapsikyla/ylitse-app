import React from 'react';
import * as RN from 'react-native';

import Message, { MessageProps } from './Message';
import DateBubble from './DateBubble';
import Spinner from 'src/Screens/components/Spinner';
import { Renderable } from '.';

import colors from 'src/Screens/components/colors';

type Props = {
  item: Renderable;
};

const RenderItem: React.FC<Props> = ({ item }) => {
  if (item.type === 'Message') {
    return <Message {...item} />;
  }

  if (item.type === 'Date') {
    return <DateBubble {...item} />;
  }

  return <Spinner style={styles.spinner} />;
};

const equalProps = (
  prevProps: React.ComponentProps<typeof RenderItem>,
  nextProps: React.ComponentProps<typeof RenderItem>,
) => {
  if (
    Object.prototype.hasOwnProperty.call(nextProps.item, 'isSeen') &&
    Object.prototype.hasOwnProperty.call(prevProps.item, 'isSeen')
  ) {
    const prev = prevProps.item as MessageProps;
    const next = nextProps.item as MessageProps;

    return prev.id === next.id && prev.isSeen === next.isSeen;
  }

  return prevProps.item.id === nextProps.item.id;
};

export const MemoizedRenderItem = React.memo(RenderItem, equalProps);

const styles = RN.StyleSheet.create({
  spinner: {
    alignSelf: 'center',
    marginVertical: 8,
    tintColor: colors.blueGray,
  },
});
