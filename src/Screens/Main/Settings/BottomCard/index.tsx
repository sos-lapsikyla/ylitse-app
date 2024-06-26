import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import * as config from '../../../../api/config';
import * as tokenState from '../../../../state/reducers/accessToken';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import MessageButton from '../../../components/MessageButton';
import Card from '../../../components/Card';
import Link from '../../../components/Link';
import Message from '../../../components/Message';

type Props = {
  navigateToLogout: () => void | undefined;
  navigateToDeleteAccount: () => void | undefined;
};

export default ({ navigateToDeleteAccount, navigateToLogout }: Props) => {
  const isMentor = useSelector(tokenState.isMentor);

  return (
    <Card style={styles.card}>
      <Message
        style={styles.accountSettingsText}
        id="main.settings.other.title"
      />
      <Link
        style={styles.link}
        linkName="main.settings.other.feedBackLink"
        url={config.feedBackUrl}
      />
      <Message style={styles.fieldName} id="main.settings.other.feedBack" />
      <Link
        style={styles.link}
        linkName="main.settings.other.termsLink"
        url={config.termsUrl}
      />
      <Message style={styles.fieldName} id="main.settings.other.whatToAgree" />
      <Link
        style={styles.link}
        linkName="main.settings.other.saferSpaceLink"
        url={config.saferSpaceUrl}
      />
      <Message
        style={styles.fieldName}
        id="main.settings.other.principalsForSaferSpace"
      />
      <MessageButton
        style={styles.logOutButton}
        onPress={navigateToLogout}
        messageId="main.settings.other.button.logOut"
        testID="main.settings.other.button.logOut"
      />
      {!isMentor && (
        <MessageButton
          style={styles.deleteAccountButton}
          messageStyle={styles.buttonText}
          onPress={navigateToDeleteAccount}
          messageId="main.settings.other.button.deleteAccount"
          testID="main.settings.other.button.deleteAccount"
        />
      )}
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 24,
    paddingBottom: 32,
    marginBottom: 32,
  },
  accountSettingsText: {
    ...fonts.titleBold,
    color: colors.darkestBlue,
  },
  fieldName: {
    ...fonts.regular,
    color: colors.blueGray,
  },
  link: {
    marginTop: 24,
    marginBottom: 8,
  },
  buttonText: {
    ...fonts.largeBold,
    color: colors.danger,
  },
  logOutButton: {
    marginTop: 32,
    alignSelf: 'flex-start',
    minWidth: '70%',
  },
  deleteAccountButton: {
    marginTop: 40,
    alignSelf: 'flex-start',
    minWidth: '70%',
    backgroundColor: colors.lightDanger,
  },
});
