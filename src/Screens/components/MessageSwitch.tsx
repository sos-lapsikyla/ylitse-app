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
}

const MessageSwitch: React.FC<Props> = ({
  messageOn,
  messageOff,
  value,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  message: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
    flexDirection: 'column',
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default MessageSwitch;
