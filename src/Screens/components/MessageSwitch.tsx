import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';

import Switch, { SwitchProps } from './Switch';

interface Props extends SwitchProps {
  messageOn: localization.MessageId;
  messageOff: localization.MessageId;
  containerStyle?: RN.ViewStyle;
}

const MessageSwitch: React.FC<Props> = ({
  messageOn,
  messageOff,
  value,
  containerStyle,
  ...switchProps
}) => {
  return (
    <RN.View style={styles.container}>
      <Switch value={value} {...switchProps} />
      <Message style={styles.message} id={value ? messageOn : messageOff} />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.red,
  },
  message: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
    marginLeft: 10,
  },
});

export default MessageSwitch;
