import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';

interface Props {
  value: boolean | undefined;
  messageOn: localization.MessageId;
  messageOff: localization.MessageId;
  toggleSwitch: () => void;
  testID?: string;
}

const ToggleSwitch = ({
  value,
  messageOn,
  messageOff,
  toggleSwitch,
  testID,
}: Props) => {
  return (
    <RN.View style={styles.container}>
      <RN.Switch
        trackColor={{ false: colors.lightGray, true: colors.lighterBlue }}
        thumbColor={value ? colors.lightBlue : colors.gray}
        onValueChange={toggleSwitch}
        value={value}
        testID={testID}
      />
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

export default ToggleSwitch;
