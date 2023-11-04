import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';

import * as authApi from '../../api/auth';

import * as localization from '../../localization';
import { ValidPassword } from '../../lib/validators';
import { isLeft } from 'fp-ts/lib/Either';

import fonts from '../components/fonts';
import colors from '../components/colors';

import Card from '../components/Card';
import Message from '../components/Message';
import NamedInputField from '../components/NamedInputField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

interface Props extends RN.ViewProps {
  onPressBack: () => void | undefined;
  onPressNext: (credentials: authApi.Credentials) => void | undefined;
  titleMessageId: localization.MessageId;
  nextMessageId: localization.MessageId;
  remoteAction: RD.RemoteData<unknown, unknown>;
  getErrorMessageId: (u: unknown) => localization.MessageId;
  onChange?: (credentials: authApi.Credentials) => void | undefined;
  isSignup?: boolean;
}

const LoginCard = ({
  onPressBack,
  onPressNext,
  titleMessageId,
  nextMessageId,
  remoteAction,
  getErrorMessageId,
  onChange,
  isSignup = false,
  style,
  ...viewProps
}: Props) => {
  const [credentials, setCredentials] = React.useState<authApi.Credentials>({
    userName: '',
    password: '',
  });

  const [isInvalidPassword, setIsInvalidPassword] =
    React.useState<boolean>(false);

  const handlePasswordValidate = () => {
    if (isSignup) {
      const passwordParsingResult = ValidPassword.decode(credentials.password);
      setIsInvalidPassword(isLeft(passwordParsingResult));
    }
  };

  const onChangeCredentials = (newCredentials: authApi.Credentials) => {
    if (onChange) {
      onChange(credentials);
    }

    setCredentials(newCredentials);
  };

  const onUserNameChange = (userName: string) =>
    onChangeCredentials({ ...credentials, userName });

  const onPasswordChange = (password: string) =>
    onChangeCredentials({ ...credentials, password });
  const isEmptyFields = !credentials.password || !credentials.userName;

  return (
    <Card style={[styles.card, style]} {...viewProps}>
      <RN.View>
        <Message style={styles.title} id={titleMessageId} />
        <NamedInputField
          autoCapitalize="none"
          style={styles.input}
          name="onboarding.signUp.userName"
          onChangeText={onUserNameChange}
          autoComplete="off"
          testID="onboarding.signUp.userName"
        />
        <NamedInputField
          autoCapitalize="none"
          style={styles.input}
          name="onboarding.signUp.password"
          isPasswordInput={true}
          onChangeText={onPasswordChange}
          autoComplete="off"
          testID="onboarding.signUp.password"
          onBlur={handlePasswordValidate}
          onSubmitEditing={handlePasswordValidate}
        />
        {isSignup && (
          <Message
            style={[
              styles.commonMessage,
              isInvalidPassword && styles.passwordErrorMessage,
            ]}
            id={'main.settings.account.password.requirements'}
          />
        )}
      </RN.View>
      <ErrorMessage
        style={styles.errorText}
        getMessageId={getErrorMessageId}
        data={remoteAction}
        testID={'components.loginCard.errorMessage'}
      />

      <RN.View style={styles.buttonContainer}>
        <Button
          messageId="onboarding.signUp.back"
          onPress={onPressBack}
          noShadow={true}
          style={styles.backButton}
          emphasis="low"
        />
        <Button
          style={styles.nextButton}
          badgeStyle={styles.badgeStyle}
          messageId={nextMessageId}
          onPress={() => onPressNext(credentials)}
          badge={require('../images/arrow-right.svg')}
          loading={RD.isPending(remoteAction)}
          disabled={isEmptyFields || isInvalidPassword}
          testID="onboarding.signUp.button"
        />
      </RN.View>
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 20,
    padding: 24,
    alignSelf: 'stretch',
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.darkestBlue,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  commonMessage: {
    ...fonts.regular,
  },
  passwordErrorMessage: {
    color: colors.danger,
  },
  errorText: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1.2,
    height: 32,
  },
  nextButton: {
    flex: 2,
    height: 32,
    marginLeft: 24,
  },
  badgeStyle: {
    height: 32,
    width: 32,
    marginLeft: 4,
  },
});
export default LoginCard;
