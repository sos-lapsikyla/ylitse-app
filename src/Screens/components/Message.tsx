import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

interface Props extends RN.TextProps {
  id: localization.MessageId;
}

const translator = localization.translator('fi');

const Message = ({ id, ...textProps }: Props) => (
  <RN.Text {...textProps}>{translator(id)}</RN.Text>
);

export const AnimatedMessage = ({
  id,
  ...textProps
}: Omit<Props, 'style'> & {
  style?: any;
}) => <RN.Animated.Text {...textProps}>{translator(id)}</RN.Animated.Text>;

export default Message;
