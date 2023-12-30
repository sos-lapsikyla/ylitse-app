import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Link from './Link';

interface Props extends RN.TextProps {
  id: localization.MessageId;
}

const Message = ({ id, ...textProps }: Props) => (
  <RN.Text {...textProps}>{localization.trans(id)}</RN.Text>
);

export const AnimatedMessage = ({
  id,
  ...textProps
}: Omit<Props, 'style'> & {
  style?: any;
}) => (
  <RN.Animated.Text {...textProps}>{localization.trans(id)}</RN.Animated.Text>
);

interface MessageLinkProps extends RN.TextProps {
  id: localization.MessageId;
  link: {
    linkName: localization.MessageId;
    url: string;
    style?: RN.StyleProp<RN.ViewStyle>;
  };
}

export const MessageWithLink = ({
  id,
  link,
  ...textProps
}: MessageLinkProps) => (
  <RN.Text {...textProps}>
    {localization.trans(id)}
    <Link {...link} />
  </RN.Text>
);

export default Message;
