import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../../lib/navigation-props';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import TitledContainer from '../../components/TitledContainer';
import colors, { gradients } from '../../components/colors';
import fonts from '../../components/fonts';

import UserAccount from './UserAccount';
import BottomCard from './BottomCard';
import { LogoutRoute } from './Logout';
import { DeleteAccountRoute } from './DeleteAccount';

export type SettingsRoute = {
  'Main/Settings': {};
};

type OwnProps = navigationProps.NavigationProps<
  SettingsRoute,
  LogoutRoute & DeleteAccountRoute
>;
type Props = OwnProps;

const Settings = ({ navigation }: Props) => {
  const onNavigateToLogout = () => {
    navigation.navigate('Main/Settings/Logout', {});
  };
  const onNavigateToDeleteAccount = () => {
    navigation.navigate('Main/Settings/DeleteAccount', {});
  };
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
        <BottomCard
          navigateToLogout={onNavigateToLogout}
          navigateToDeleteAccount={onNavigateToDeleteAccount}
        />
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
});

export default Settings;
