import React from 'react';
import { createAppContainer } from 'react-navigation';
import * as reactNavigationStack from 'react-navigation-stack';

import Splash, { SplashRoute } from './Splash';
import MentorList, { MentorListRoute } from './Onboarding/MentorList';
import SignUp, { SignUpRoute } from './Onboarding/SignUp';
import DisplayName, { DisplayNameRoute } from './Onboarding/DisplayName';
import Email, { EmailRoute } from './Onboarding/Email';
import PrivacyPolicy, { PrivacyPolicyRoute } from './Onboarding/PrivacyPolicy';
import SignIn, { SignInRoute } from './Onboarding/SignIn';
import Tabs, { TabsRoute } from './Main/Tabs';
import MentorCardExpanded, {
  MentorCardExpandedRoute,
} from './Main/MentorCardExpanded';

import Chat, { ChatRoute } from './Main/Chat';
import Logout, { LogoutRoute } from './Main/Settings/Logout';

type RouteName = keyof (SplashRoute &
  MentorListRoute &
  SignUpRoute &
  DisplayNameRoute &
  EmailRoute &
  PrivacyPolicyRoute &
  SignInRoute &
  TabsRoute &
  MentorCardExpandedRoute &
  ChatRoute &
  LogoutRoute);
type Screen =
  | typeof Splash
  | typeof MentorList
  | typeof SignUp
  | typeof DisplayName
  | typeof Email
  | typeof PrivacyPolicy
  | typeof SignIn
  | typeof Tabs
  | typeof MentorCardExpanded
  | typeof Chat
  | typeof Logout;

export type Route = keyof typeof routes;
const routes: {
  [name in RouteName]: { screen: Screen };
} = {
  Splash: {
    screen: Splash,
  },
  'Onboarding/MentorList': {
    screen: MentorList,
  },
  'Onboarding/SignUp': {
    screen: SignUp,
  },
  'Onboarding/SignIn': {
    screen: SignIn,
  },
  'Onboarding/DisplayName': {
    screen: DisplayName,
  },
  'Onboarding/Email': {
    screen: Email,
  },
  'Onboarding/PrivacyPolicy': {
    screen: PrivacyPolicy,
  },
  'Main/Tabs': {
    screen: Tabs,
  },
  'Main/MentorCardExpanded': {
    screen: MentorCardExpanded,
  },
  'Main/Chat': {
    screen: Chat,
  },
  'Main/Settings/Logout': {
    screen: Logout,
  },
};

const initialRouteName: RouteName = 'Splash';
const config = {
  initialRouteName,
  headerMode: 'none' as const,
};
const StackNavigator = reactNavigationStack.createStackNavigator(
  routes,
  config,
);
const AppContainer = createAppContainer(StackNavigator);

export default () => <AppContainer />;
