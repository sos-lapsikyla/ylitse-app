import * as reactNavigation from 'react-navigation';

import * as navigationProps from '../../../lib/navigation-props';

import { MentorListRoute } from '../../Onboarding/MentorList';

const routeName: keyof MentorListRoute = 'Onboarding/MentorList';

const navigateOnboarding = <
  A extends navigationProps.RouteDeclaration<string, string, unknown>,
  B extends MentorListRoute
>(
  navigation: navigationProps.NavigationProps<A, B>['navigation'],
) => {
  const resetAction = reactNavigation.StackActions.reset({
    index: 0,
    actions: [
      reactNavigation.NavigationActions.navigate({
        routeName,
      }),
    ],
  });
  navigation.dispatch(resetAction);
};
export default navigateOnboarding;
