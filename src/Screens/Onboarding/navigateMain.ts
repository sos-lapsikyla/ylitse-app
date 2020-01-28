import * as reactNavigation from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import { TabsRoute } from '../Main/Tabs';

const routeName: keyof TabsRoute = 'Main/Tabs';

const navigateMain = <
  A extends navigationProps.RouteDeclaration<string, string, unknown>,
  B extends TabsRoute
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
export default navigateMain;
