import React from 'react';
import RN from 'react-native';

import Button from './Button';
import { textShadow } from './shadow';
import colors from './colors';
import fonts from './fonts';
import NamedInputField from './NamedInputField';

type Props = {
  currentPassword: string;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  repeatedNewPassword: string;
  setRepeatedNewPassword: React.Dispatch<React.SetStateAction<string>>;
  onGoBack: () => void;
  onButtonPress: () => void;
  isOkay: boolean;
};

export default (props: Props) => {
  return (
    <>
      <NamedInputField
        style={styles.field}
        name="main.settings.account.password.current"
        isPasswordInput={true}
        value={props.currentPassword}
        onChangeText={props.setCurrentPassword}
        testID="main.settings.account.password.current"
      />
      <NamedInputField
        style={styles.field}
        name="main.settings.account.password.new"
        isPasswordInput={true}
        value={props.newPassword}
        onChangeText={props.setNewPassword}
        testID="main.settings.account.password.new"
      />
      <NamedInputField
        style={styles.field}
        name="main.settings.account.password.repeat"
        isPasswordInput={true}
        value={props.repeatedNewPassword}
        onChangeText={props.setRepeatedNewPassword}
        testID="main.settings.account.password.repeat"
      />
      <RN.View style={styles.buttonContainer}>
        <Button
          style={styles.cancelButton}
          messageStyle={styles.cancelButtonText}
          onPress={props.onGoBack}
          messageId="meta.cancel"
          testID="main.settings.account.password.cancel"
        />
        <Button
          style={styles.changePasswordButton}
          messageStyle={styles.buttonText}
          onPress={props.onButtonPress}
          messageId="meta.save"
          disabled={!props.isOkay}
          testID="main.settings.account.password.save"
        />
      </RN.View>
    </>
  );
};

const styles = RN.StyleSheet.create({
  field: {
    marginVertical: 10,
  },
  cancelButtonText: {
    ...fonts.large,
    color: colors.darkestBlue,
  },
  changePasswordButton: {
    backgroundColor: colors.blue,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
  cancelButton: { backgroundColor: colors.gray, marginBottom: 16 },
});
