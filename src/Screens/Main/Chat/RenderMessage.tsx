import React, { ComponentProps } from 'react';

import Message from './MessageList/Message';
import DateBubble from './MessageList/DateBubble';
import { Renderable } from './MessageList';

type Props = {
  item: Renderable;
};

const RenderItem: React.FC<Props> = ({ item }) => {
  if (item.type === 'Message') {
    return <Message {...item} />;
  } else {
    return <DateBubble {...item} />;
  }
};

const equalProps = (
  prevProps: ComponentProps<typeof RenderItem>,
  nextProps: ComponentProps<typeof RenderItem>,
) => prevProps.item.id === nextProps.item.id;

export const MemoizedRenderItem = React.memo(RenderItem, equalProps);
