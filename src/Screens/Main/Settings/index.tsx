import React from 'react';
import RN from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

import Message from '../../components/Message';
import { textShadow } from '../../components/shadow';
import TitledContainer from '../../components/TitledContainer';
import colors from '../../components/colors';
import fonts from '../../components/fonts';

import UserAccount from './UserAccount';
import BottomCard from './BottomCard';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabRoutes } from '../Tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type SettingsRoute = {
  'Main/Settings': {};
};

type OwnProps = CompositeScreenProps<
  BottomTabScreenProps<TabRoutes, 'Main/Settings'>,
  StackScreenProps<StackRoutes>
>;
type Props = OwnProps;

const Settings = ({ navigation }: Props) => {
  const onNavigateToLogout = () => {
    navigation.navigate('Main/Settings/Logout', {});
  };

  const onNavigateToDeleteAccount = () => {
    navigation.navigate('Main/Settings/DeleteAccount', {});
  };

  const onNavigateToPasswordChange = () => {
    navigation.navigate('Main/Settings/PasswordChange', {});
  };

  const onNavigateToEmailChange = () => {
    navigation.navigate('Main/Settings/EmailChange', {});
  };

  return (
    <TitledContainer
      TitleComponent={
        <Message id="main.settings.title" style={styles.screenTitleText} />
      }
      color={colors.blue}
    >
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID={'main.settings.index.view'}
      >
        <UserAccount
          navigateToPassword={onNavigateToPasswordChange}
          navigateToEmail={onNavigateToEmailChange}
        />
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
    color: colors.darkestBlue,
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
