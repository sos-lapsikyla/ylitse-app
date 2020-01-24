import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as reactNavigationTab from 'react-navigation-tabs';

import colors from '../components/colors';
import fonts from '../components/fonts';
import shadow from '../components/shadow';

import BuddyList, { BuddyListRoute } from './BuddyList';

type RouteName = keyof (BuddyListRoute) | 'Mentors' | 'Settings';
type Screen = typeof BuddyList;

const routeConfig: {
  [name in RouteName]: Screen;
} = { BuddyList: BuddyList, Mentors: BuddyList, Settings: BuddyList };

const Main = reactNavigationTab.createBottomTabNavigator(routeConfig, {
  tabBarComponent: props => (
    <TabBar
      {...props}
      labels={['settings', 'mentors', 'chats']}
      icons={[
        require('../images/cog.svg'),
        require('../images/users.svg'),
        require('../images/balloon.svg'),
      ]}
    />
  ),
});

type Props = {
  labels: string[];
  icons: RN.ImageSourcePropType[];
};

const TabBar = ({
  navigation,
  onTabPress,
  labels,
  icons,
}: reactNavigationTab.BottomTabBarProps & Props) => {
  const routes = navigation.state.routes;
  const currentIndex = navigation.state.index;

  return (
    <RN.View style={styles.tabBar}>
      <SafeAreaView style={styles.safeArea} forceInset={{ bottom: 'always' }}>
        {routes.map((route, index) => {
          const navRoute = { route };
          const routeName = labels[index];

          const [iconStyle, labelStyle] =
            index === currentIndex
              ? [styles.selectedIcon, styles.selectedLabel]
              : [styles.icon, styles.label];

          return (
            <RN.View key={route.key} style={styles.container}>
              {index > 0 ? <RN.View style={styles.separator} /> : null}
              <RN.TouchableOpacity
                style={styles.tab}
                onPress={() => onTabPress(navRoute)}
              >
                <RN.Image style={iconStyle} source={icons[index]} />
                <RN.Text style={labelStyle}>{routeName}</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
          );
        })}
      </SafeAreaView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  tabBar: {
    ...shadow(7),
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 40,
    minHeight: 64,
    backgroundColor: colors.haze,
  },
  safeArea: {
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 40,
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 48,
    width: 1,
    backgroundColor: colors.lightTeal,
    opacity: 0.8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray,
    flex: 1,
  },
  label: {
    ...fonts.small,
    textAlign: 'center',
    color: colors.faintBlue,
    marginTop: 8,
  },
  selectedLabel: {
    ...fonts.smallBold,
    textAlign: 'center',
    color: colors.deepBlue,
    marginTop: 8,
  },
  icon: { tintColor: colors.faintBlue },
  selectedIcon: { tintColor: colors.deepBlue },
});

export default Main;
export type MainRoute = { Main: {} };
