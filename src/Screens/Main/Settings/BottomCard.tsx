import React from 'react';
import RN from 'react-native';

import * as config from '../../../api/config';

import MessageButton from '../../components/MessageButton';
import Card from '../../components/Card';
import Link from '../../components/Link';
import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import colors from '../../components/colors';
import fonts from '../../components/fonts';

type Props = {
  navigateToLogout: () => void | undefined;
  navigateToDeleteAccount: () => void | undefined;
};

export default ({ navigateToDeleteAccount, navigateToLogout }: Props) => {
  return (
    <Card style={styles.card}>
      <Message
        style={styles.accountSettingsText}
        id="main.settings.other.title"
      />
      <Message style={styles.fieldName} id="main.settings.other.feedBack" />
      <Link
        style={styles.link}
        linkName="main.settings.other.feedBackLink"
        url={config.feedBackUrl}
      />
      <Message style={styles.fieldName} id="main.settings.other.howTo" />
      <Link
        style={styles.link}
        linkName="main.settings.other.userGuide"
        url={config.userGuideUrl}
      />
      <Message style={styles.fieldName} id="main.settings.other.whatToAgree" />
      <Link
        style={styles.link}
        linkName="main.settings.other.termsLink"
        url={config.termsUrl}
      />
      <MessageButton
        style={styles.logOutButton}
        messageStyle={styles.buttonText}
        onPress={navigateToLogout}
        messageId="main.settings.other.button.logOut"
      />
      <MessageButton
        style={styles.deleteAccountButton}
        messageStyle={styles.buttonText}
        onPress={navigateToDeleteAccount}
        messageId="main.settings.other.button.deleteAccount"
      />
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
    color: colors.deepBlue,
    marginBottom: 24,
  },
  fieldName: {
    ...fonts.regular,
    color: colors.faintBlue,
  },
  link: {
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
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
    backgroundColor: colors.danger,
  },
});
