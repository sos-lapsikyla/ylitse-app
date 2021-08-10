import React, { useState } from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';

interface Props {
  initialValue: boolean | undefined;
  messageOn: localization.MessageId;
  messageOff: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  toggleSwitch: () => boolean;
  testID?: string;
}

const ToggleSwitch = ({
  initialValue,
  messageOn,
  messageOff,
  messageStyle,
  toggleSwitch,
  testID,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const onPress = () => {
    if (toggleSwitch()) {
      setIsEnabled(previousState => !previousState);
    }
  };

  return (
    <RN.View style={styles.container}>
      <RN.Switch
        trackColor={{ false: colors.lightGray, true: colors.lighterBlue }}
        thumbColor={isEnabled ? colors.lightBlue : colors.gray}
        onValueChange={onPress}
        value={isEnabled}
        testID={testID}
      />
      <Message
        style={[styles.message, messageStyle]}
        id={isEnabled ? messageOn : messageOff}
      />
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

export default ToggleSwitch;
