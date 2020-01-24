import * as reactNavigationStack from 'react-navigation-stack';

import MentorList, { MentorListRoute } from './MentorList';
import SignUp, { SignUpRoute } from './SignUp';
import SignIn, { SignInRoute } from './SignIn';
import BuddyList, { BuddyListRoute } from './BuddyList';

type RouteName = keyof (MentorListRoute &
  SignUpRoute &
  SignInRoute &
  BuddyListRoute);
type Screen =
  | typeof MentorList
  | typeof SignUp
  | typeof SignIn
  | typeof BuddyList;

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
  BuddyList: {
    screen: BuddyList,
  },
};

const initialRouteName: RouteName = 'Onboarding/MentorList';
const config = {
  initialRouteName,
  headerMode: 'none' as const,
};

export default reactNavigationStack.createStackNavigator(routes, config);
