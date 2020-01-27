import React from 'react';
import { createAppContainer } from 'react-navigation';
import * as reactNavigationStack from 'react-navigation-stack';

import MentorList, { MentorListRoute } from './Onboarding/MentorList';
import SignUp, { SignUpRoute } from './Onboarding/SignUp';
import SignIn, { SignInRoute } from './Onboarding/SignIn';
import Tabs, { TabsRoute } from './Main/Tabs';

type RouteName = keyof (MentorListRoute &
  SignUpRoute &
  SignInRoute &
  TabsRoute);
type Screen = typeof MentorList | typeof SignUp | typeof SignIn | typeof Tabs;

export type Route = keyof typeof routes;
const routes: {
  [name in RouteName]: { screen: Screen };
} = {
  'Onboarding/MentorList': {
    screen: MentorList,
  },
  'Onboarding/SignUp': {
    screen: SignUp,
  },
  'Onboarding/SignIn': {
    screen: SignIn,
  },
  'Main/Tabs': {
    screen: Tabs,
  },
};

const initialRouteName: RouteName = 'Onboarding/MentorList';
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
