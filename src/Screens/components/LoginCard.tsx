import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';

import * as authApi from '../../api/auth';

import * as localization from '../../localization';

import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors from '../components/colors';
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
}

const LoginCard = ({
  onPressBack,
  onPressNext,
  titleMessageId,
  nextMessageId,
  remoteAction,
  getErrorMessageId,
  onChange,
  style,
  ...viewProps
}: Props) => {
  const [credentials, setCredentials] = React.useState<authApi.Credentials>({
    userName: '',
    password: '',
  });

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
          style={styles.nickNameInput}
          name="onboarding.signUp.userName"
          onChangeText={onUserNameChange}
          autoComplete="off"
          testID="onboarding.signUp.userName"
        />
        <NamedInputField
          autoCapitalize="none"
          style={styles.passwordInput}
          name="onboarding.signUp.password"
          isPasswordInput={true}
          onChangeText={onPasswordChange}
          autoComplete="off"
          testID="onboarding.signUp.password"
        />
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
        />

        <Button
          style={styles.nextButton}
          badgeStyle={styles.badgeStyle}
          messageId={nextMessageId}
          onPress={() => onPressNext(credentials)}
          badge={require('../images/arrow-right.svg')}
          loading={RD.isPending(remoteAction)}
          disabled={isEmptyFields}
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
  nickNameInput: {
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 10,
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
    backgroundColor: colors.lightestGray,
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
