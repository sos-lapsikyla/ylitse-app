import * as reactNavigationStack from 'react-navigation-stack';

import MentorList from './MentorList';

export type Route = keyof typeof routes;
const routes = {
  'Onboarding/MentorList': {
    screen: MentorList,
  },
};

const config = {
  initialRouteName: 'Onboarding/MentorList',
  headerMode: 'none' as const,
};

export default reactNavigationStack.createStackNavigator(routes, config);
