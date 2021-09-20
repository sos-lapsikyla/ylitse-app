import React from 'react';
import RN from 'react-native';

import Button from './Button';
import colors from './colors';
import fonts from './fonts';
import InputField from './InputField';
import { textShadow } from './shadow';

type Props = {
  statusMessage: string;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
  onButtonPress: () => void;
  maxLength: number;
};

export default (props: Props) => {
  return (
    <>
      <InputField
        style={styles.field}
        value={props.statusMessage}
        onChangeText={props.setStatusMessage}
        maxLength={props.maxLength}
        multiline={true}
        testID="main.settings.account.status.input"
      />
      <RN.Text style={styles.maxCharactersText}>
        {props.statusMessage.length}/{props.maxLength}
      </RN.Text>
      <Button
        style={styles.saveButton}
        messageStyle={styles.buttonText}
        onPress={props.onButtonPress}
        messageId="meta.save"
        testID="main.settings.account.status.save"
      />
    </>
  );
};

const styles = RN.StyleSheet.create({
  field: {
    marginVertical: 8,
  },
  saveButton: {
    marginTop: 32,
    alignSelf: 'flex-start',
    minWidth: '70%',
    backgroundColor: colors.blue,
  },
  maxCharactersText: {
    alignSelf: 'flex-end',
    color: colors.blueGray,
    marginRight: 8,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
});
