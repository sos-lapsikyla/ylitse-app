import React from 'react';
import RN from 'react-native';

import {
  getPasswordState,
  passwordRequirementsMessage,
  PasswordState,
} from './getState';

import fonts from '../../../components/fonts';
import colors from '../../../components/colors';

import Button from '../../../components/Button';
import NamedInputField from '../../../components/NamedInputField';
import IconButton from '../../../components/IconButton';
import Message from '../../../components/Message';

type Props = {
  currentPassword: string;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  repeatedNewPassword: string;
  setRepeatedNewPassword: React.Dispatch<React.SetStateAction<string>>;
  onGoBack: () => void;
  onButtonPress: () => void;
};

export default (props: Props) => {
  const [passwordState, setNewPasswordState] = React.useState<
    PasswordState & { hasBeenValidated: boolean }
  >({ hasBeenValidated: false, isOkay: true, ...passwordRequirementsMessage });

  const handlePasswordValidate = () => {
    const nextState = getPasswordState(
      props.currentPassword,
      props.newPassword,
      props.repeatedNewPassword,
    );
    setNewPasswordState({ ...nextState, hasBeenValidated: true });
  };

  const handleChange = (onChange: (value: string) => void, value: string) => {
    if (passwordState.hasBeenValidated) {
      handlePasswordValidate();
    }

    onChange(value);
  };

  return (
    <RN.KeyboardAvoidingView
      style={styles.keyboardAvoider}
      behavior={'padding'}
    >
      <RN.View>
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.current"
          isPasswordInput={true}
          value={props.currentPassword}
          onChangeText={value => handleChange(props.setCurrentPassword, value)}
          testID="main.settings.account.password.current"
        />
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.new"
          isPasswordInput={true}
          value={props.newPassword}
          onChangeText={value => handleChange(props.setNewPassword, value)}
          testID="main.settings.account.password.new"
        />
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.repeat"
          isPasswordInput={true}
          value={props.repeatedNewPassword}
          onChangeText={value =>
            handleChange(props.setRepeatedNewPassword, value)
          }
          onBlur={handlePasswordValidate}
          onSubmitEditing={handlePasswordValidate}
          testID="main.settings.account.password.repeat"
        />
      </RN.View>
      <Message
        style={[
          styles.commonMessage,
          !passwordState.isOkay && styles.errorMessage,
        ]}
        id={passwordState.messageId}
      />
      <RN.View style={styles.buttonContainer}>
        <IconButton
          badge={require('../../../images/chevron-left.svg')}
          badgeStyle={styles.badge}
          onPress={props.onGoBack}
          testID="main.settings.account.password.cancel"
        />
        <Button
          style={styles.button}
          onPress={props.onButtonPress}
          messageId="main.settings.account.password.button"
          disabled={!passwordState.isOkay}
          testID="main.settings.account.password.save"
        />
      </RN.View>
    </RN.KeyboardAvoidingView>
  );
};

const styles = RN.StyleSheet.create({
  keyboardAvoider: {
    display: 'flex',
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  field: {
    marginVertical: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    gap: 24,
  },
  commonMessage: {
    ...fonts.regular,
    marginBottom: -24,
  },
  errorMessage: {
    color: colors.danger,
  },
  badge: {
    width: 32,
    height: 32,
  },
  button: {
    minWidth: 200,
  },
});
