import * as reactNavigationStack from 'react-navigation-stack';

import MentorList, { MentorListRoute } from './MentorList';
import SignUp, { SignUpRoute } from './SignUp';

type RouteName = keyof (MentorListRoute & SignUpRoute);
type Screen = typeof MentorList | typeof SignUp;

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
};

const initialRouteName: RouteName = 'Onboarding/MentorList';
const config = {
  initialRouteName,
  headerMode: 'none' as const,
};

export default reactNavigationStack.createStackNavigator(routes, config);
