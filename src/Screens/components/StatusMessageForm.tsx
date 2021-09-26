import React from 'react';
import RN from 'react-native';

import colors from './colors';
import fonts from './fonts';
import { textShadow } from './shadow';

import Button from './Button';
import LoadingInputField from './LoadingInputField';

type Props = {
  statusMessage: string;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
  onButtonPress: () => void;
  maxLength: number;
  isLoading: boolean;
};

export default (props: Props) => {
  return (
    <>
      <LoadingInputField
        style={styles.field}
        value={props.statusMessage}
        onChangeText={props.setStatusMessage}
        maxLength={props.maxLength}
        multiline={true}
        isLoading={props.isLoading}
        testID="main.settings.account.status.input"
      />
      <RN.Text style={styles.maxCharactersText}>
        {props.statusMessage.length}/{props.maxLength}
      </RN.Text>
      <Button
        style={styles.saveButton}
        messageStyle={styles.buttonText}
        onPress={props.onButtonPress}
        messageId="main.settings.account.status.save"
        testID="main.settings.account.status.save"
        disabled={props.isLoading}
      />
    </>
  );
};

const styles = RN.StyleSheet.create({
  field: {
    marginVertical: 8,
  },
  saveButton: {
    marginTop: 16,
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
