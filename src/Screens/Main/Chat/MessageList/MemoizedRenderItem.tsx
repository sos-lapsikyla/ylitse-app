import React, { ComponentProps } from 'react';

import Message from './Message';
import DateBubble from './DateBubble';
import { Renderable } from '.';

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
