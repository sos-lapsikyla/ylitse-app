import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../../lib/navigation-props';
import * as config from '../../../api/config';

import Button from '../../components/Button';
import Card from '../../components/Card';
import Link from '../../components/Link';
import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import TitledContainer from '../../components/TitledContainer';
import colors, { gradients } from '../../components/colors';
import fonts from '../../components/fonts';

import UserAccount from './UserAccount';

export type SettingsRoute = {
  'Main/Settings': {};
};

type OwnProps = navigationProps.NavigationProps<SettingsRoute, SettingsRoute>;
type Props = OwnProps;

const Settings = (_: Props) => {
  return (
    <TitledContainer
      TitleComponent={
        <Message id="main.settings.title" style={styles.screenTitleText} />
      }
      gradient={gradients.pillBlue}
    >
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserAccount />
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
          <Message
            style={styles.fieldName}
            id="main.settings.other.whatToAgree"
          />
          <Link
            style={styles.link}
            linkName="main.settings.other.termsLink"
            url={config.termsUrl}
          />
          <Button
            style={styles.otherButton}
            messageStyle={styles.buttonText}
            onPress={() => {}}
            messageId="main.settings.other.button.logOut"
            gradient={gradients.pillBlue}
          />
          <Button
            style={styles.otherButton}
            messageStyle={styles.buttonText}
            onPress={() => {}}
            messageId="main.settings.other.button.deleteAccount"
            gradient={gradients.danger}
          />
        </Card>
      </RN.ScrollView>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 320,
    paddingHorizontal: 16,
  },
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
  fieldValueText: {
    ...fonts.largeBold,
    color: colors.deepBlue,
    marginBottom: 16,
  },
  link: {
    marginTop: 8,
    marginBottom: 24,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
  otherButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
});

export default Settings;
