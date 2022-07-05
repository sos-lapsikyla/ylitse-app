import React from 'react';
import RN from 'react-native';
import * as reactRedux from 'react-redux';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import * as reactNavigationTab from 'react-navigation-tabs';

import * as ReactRedux from 'react-redux';

import * as localization from '../../localization';
import { isAnyMessageUnseen } from '../../state/reducers/messages';

import colors from '../components/colors';
import fonts from '../components/fonts';
import shadow from '../components/shadow';

import BuddyList, { BuddyListRoute } from './BuddyList';
import MentorList, { MentorListRoute } from './MentorList';
import Settings, { SettingsRoute } from './Settings';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';
import { selectFirstQuestion } from '../../state/reducers/questions';

export type TabsRoute = { 'Main/Tabs': {} };

type RouteName =
  | keyof BuddyListRoute
  | keyof MentorListRoute
  | keyof SettingsRoute;
type Screen = typeof BuddyList | typeof MentorList | typeof Settings;

const routeConfig: {
  [name in RouteName]: Screen;
} = {
  'Main/Settings': Settings,
  'Main/MentorList': MentorList,
  'Main/BuddyList': BuddyList,
};

const Main = reactNavigationTab.createBottomTabNavigator(routeConfig, {
  initialRouteName: 'Main/MentorList',
  tabBarComponent: props => (
    <TabBar
      {...props}
      labels={[
        localization.trans('tabs.settings'),
        localization.trans('tabs.mentors'),
        localization.trans('tabs.chats'),
      ]}
      icons={[
        require('../images/cog.svg'),
        require('../images/users.svg'),
        require('../images/balloon.svg'),
      ]}
      testIDs={['tabs.settings', 'tabs.mentors', 'tabs.chats']}
    />
  ),
});

type Props = {
  labels: string[];
  icons: RN.ImageSourcePropType[];
  testIDs: string[];
};

const TabBar = ({
  navigation,
  onTabPress,
  labels,
  icons,
  testIDs,
}: reactNavigationTab.BottomTabBarProps & Props) => {
  const routes = navigation.state.routes;
  const currentIndex = navigation.state.index;
  const dispatch = ReactRedux.useDispatch();

  const appState = React.useRef(RN.AppState.currentState);

  const handleFetchQuestions = () =>
    dispatch({ type: 'feedback/getQuestions/start', payload: undefined });

  const feedbackQuestion = ReactRedux.useSelector(selectFirstQuestion);

  const handleCloseQuestion = () =>
    dispatch({ type: 'feedback/reset/', payload: undefined });

  const handleAnswer = (answer: Answer) =>
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });

  React.useEffect(() => {
    const subscription = RN.AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'active') {
          handleFetchQuestions();
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <RN.View style={styles.tabBar}>
      <SafeAreaView style={styles.safeArea} forceInset={{ bottom: 'always' }}>
        {routes.map((route, index) => {
          const navRoute = { route };
          const routeName = labels[index];
          const testID = testIDs[index];

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
                testID={testID}
              >
                {index === 2 ? <UnseenDot /> : null}
                <RN.Image style={iconStyle} source={icons[index]} />
                <RN.Text style={labelStyle}>{routeName}</RN.Text>
              </RN.TouchableOpacity>
              {feedbackQuestion && (
                <QuestionModal
                  question={feedbackQuestion}
                  onClose={handleCloseQuestion}
                  onAnswer={handleAnswer}
                />
              )}
            </RN.View>
          );
        })}
        <NavigationEvents onDidFocus={handleFetchQuestions} />
      </SafeAreaView>
    </RN.View>
  );
};

const UnseenDot = () => {
  const isUnseen = reactRedux.useSelector(isAnyMessageUnseen);

  return isUnseen ? (
    <RN.View style={unseenDotStyles.dot} testID={'main.tabs.unseenDot'} />
  ) : null;
};

const unseenDotStyles = RN.StyleSheet.create({
  dot: {
    zIndex: 2,
    borderRadius: 8,
    width: 16,
    height: 16,
    backgroundColor: 'yellow',
    position: 'absolute',
    transform: [{ translateX: 16 }, { translateY: -32 }],
  },
});

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
    backgroundColor: colors.lightestGray,
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
    backgroundColor: colors.teal,
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
    color: colors.blueGray,
    marginTop: 8,
  },
  selectedLabel: {
    ...fonts.smallBold,
    textAlign: 'center',
    color: colors.darkestBlue,
    marginTop: 8,
  },
  icon: { tintColor: colors.blueGray },
  selectedIcon: { tintColor: colors.darkestBlue },
});

export default Main;
