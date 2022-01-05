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
  containerStyle?: RN.StyleProp<RN.ViewStyle>;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
}

const MessageSwitch: React.FC<Props> = ({
  messageOn,
  messageOff,
  value,
  containerStyle,
  messageStyle,
  ...switchProps
}) => {
  return (
    <RN.View style={[styles.container, containerStyle]}>
      <Switch value={value} {...switchProps} />
      <Message
        style={[styles.message, messageStyle]}
        id={value ? messageOn : messageOff}
        onPress={switchProps.onPress}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    ...fonts.large,
    color: colors.darkestBlue,
    marginLeft: 16,
    flexShrink: 1,
  },
});

export default MessageSwitch;
