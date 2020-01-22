import React from 'react';
import RN from 'react-native';

import * as authApi from '../../api/auth';

import * as localization from '../../localization';

import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
import NamedInputField from '../components/NamedInputField';
import Button from '../components/Button';

interface Props extends RN.ViewProps {
  onPressBack: () => void | undefined;
  onPressNext: (credentials: authApi.Credentials) => void | undefined;
  titleMessageId: localization.MessageId;
  nextMessageId: localization.MessageId;
}

const LoginCard = ({
  onPressBack,
  onPressNext,
  titleMessageId,
  nextMessageId,
  ...viewProps
}: Props) => {
  const [credentials, setCredentials] = React.useState<authApi.Credentials>({
    userName: '',
    password: '',
  });
  const onUserNameChange = (userName: string) =>
    setCredentials({ ...credentials, userName });
  const onPasswordChange = (password: string) =>
    setCredentials({ ...credentials, password });
  return (
    <Card {...viewProps}>
      <Message style={styles.title} id={titleMessageId} />
      <NamedInputField
        autoCapitalize="none"
        style={styles.nickNameInput}
        name="onboarding.signUp.nickName"
        onChangeText={onUserNameChange}
        autoCompleteType="off"
      />
      <NamedInputField
        autoCapitalize="none"
        style={styles.passwordInput}
        name="onboarding.signUp.password"
        isPasswordInput={true}
        onChangeText={onPasswordChange}
        autoCompleteType="off"
      />
      <RN.View style={styles.buttonContainer}>
        <Button
          style={styles.signUpButton}
          messageId={nextMessageId}
          onPress={() => onPressNext(credentials)}
          badge={require('../images/arrow.svg')}
        />
        <Button
          gradient={[colors.faintGray, colors.faintGray]}
          messageId="onboarding.signUp.back"
          onPress={onPressBack}
          noShadow={true}
        />
      </RN.View>
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.deepBlue,
    marginBottom: 40,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  passwordInput: {
    marginBottom: 40,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signUpButton: {
    flexGrow: 1,
    marginBottom: 16,
  },
});
export default LoginCard;
