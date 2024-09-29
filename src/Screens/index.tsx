import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as reactNavigationStack from '@react-navigation/stack';

import Splash, { SplashRoute } from './Splash';
import Welcome, { WelcomeRoute } from './Onboarding/Welcome';
import MentorList, { MentorListRoute } from './Onboarding/MentorList';
import Sign, { SignRoute } from './Onboarding/Sign';
import SignUp, { SignUpRoute } from './Onboarding/SignUp';
import DisplayName, { DisplayNameRoute } from './Onboarding/DisplayName';
import Email, { EmailRoute } from './Onboarding/Email';
import PrivacyPolicy, { PrivacyPolicyRoute } from './Onboarding/PrivacyPolicy';
import SearchMentor, { SearchMentorRoute } from './Main/MentorSearch';

import SignIn, { SignInRoute } from './Onboarding/SignIn';
import Tabs, { TabsRoute } from './Main/Tabs';
import MentorCardExpanded, {
  MentorCardExpandedRoute,
} from './Main/MentorCardExpanded';

import Chat, { ChatRoute } from './Main/Chat';
import FolderedChats from './Main/FolderedChats';
import { FolderedChatsRoute } from './Main/FolderedChats/folderedChatProperties';
import Logout, { LogoutRoute } from './Main/Settings/BottomCard/Logout';
import DeleteAccount, {
  DeleteAccountRoute,
} from './Main/Settings/BottomCard/DeleteAccount';
import PasswordChange, { PasswordChangeRoute } from './Main/Settings/Password';
import EmailChange, { EmailChangeRoute } from './Main/Settings/Email/Email';
import UserReport, { UserReportRoute } from './Main/UserReport';
import { VersionCheckRoute } from './VersionCheck';

export type StackRoutes = SplashRoute &
  VersionCheckRoute &
  WelcomeRoute &
  MentorListRoute &
  SignRoute &
  DisplayNameRoute &
  EmailRoute &
  PrivacyPolicyRoute &
  SearchMentorRoute &
  SignInRoute &
  TabsRoute &
  MentorCardExpandedRoute &
  ChatRoute &
  UserReportRoute &
  FolderedChatsRoute &
  LogoutRoute &
  DeleteAccountRoute &
  PasswordChangeRoute &
  EmailChangeRoute &
  SignUpRoute;

const Stack = reactNavigationStack.createStackNavigator<StackRoutes>();

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="VersionCheck"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Onboarding/Welcome" component={Welcome} />
      <Stack.Screen name="Onboarding/MentorList" component={MentorList} />
      <Stack.Screen name="Onboarding/Sign" component={Sign} />
      <Stack.Screen name="Onboarding/SignUp" component={SignUp} />
      <Stack.Screen name="Onboarding/SignIn" component={SignIn} />
      <Stack.Screen name="Onboarding/DisplayName" component={DisplayName} />
      <Stack.Screen name="Onboarding/Email" component={Email} />
      <Stack.Screen name="Onboarding/PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="Main/Tabs" component={Tabs} />
      <Stack.Screen
        name="Main/MentorCardExpanded"
        component={MentorCardExpanded}
      />
      <Stack.Screen name="Main/SearchMentor" component={SearchMentor} />
      <Stack.Screen name="Main/Chat" component={Chat} />
      <Stack.Screen name="Main/UserReport" component={UserReport} />
      <Stack.Screen name="Main/FolderedChats" component={FolderedChats} />
      <Stack.Screen name="Main/Settings/Logout" component={Logout} />
      <Stack.Screen
        name="Main/Settings/DeleteAccount"
        component={DeleteAccount}
      />
      <Stack.Screen
        name="Main/Settings/PasswordChange"
        component={PasswordChange}
      />
      <Stack.Screen name="Main/Settings/EmailChange" component={EmailChange} />
    </Stack.Navigator>
  </NavigationContainer>
);
