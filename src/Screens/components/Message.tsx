import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

interface Props extends RN.TextProps {
  id: localization.MessageKey;
}

const translator = localization.translator('fi');

const Message = ({ id, ...textProps }: Props) => (
  <RN.Text {...textProps}>{translator(id)}</RN.Text>
);

export default Message;
