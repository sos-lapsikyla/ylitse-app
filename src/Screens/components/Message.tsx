import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

interface Props {
  id: localization.MessageKey;
}

const translator = localization.translator('fi');

const Message = ({ id }: Props) => <RN.Text>{translator(id)}</RN.Text>;

export default Message;
