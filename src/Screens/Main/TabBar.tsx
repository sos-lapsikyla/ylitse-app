import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';
import { selectFirstQuestion } from '../../state/reducers/questions';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import * as localization from '../../localization';
import { isAnyMessageUnseen } from '../../state/reducers/messages';

import colors from '../components/colors';
import fonts from '../components/fonts';
import shadow from '../components/shadow';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabSettings = {
  icon: RN.ImageSourcePropType;
  text: string;
  testID: string;
};

const TabMap: Array<TabSettings> = [
  {
    icon: require('../images/cog.svg'),
    text: localization.trans('tabs.settings'),
    testID: 'tabs.settings',
  },
  {
    icon: require('../images/users.svg'),
    text: localization.trans('tabs.mentors'),
    testID: 'tabs.mentors',
  },
  {
    icon: require('../images/balloon.svg'),
    text: localization.trans('tabs.chats'),
    testID: 'tabs.chats',
  },
];

type Props = BottomTabBarProps;

export const TabBar = ({ state, navigation }: Props) => {
  const dispatch = ReactRedux.useDispatch();

  const feedbackQuestion = ReactRedux.useSelector(selectFirstQuestion);

  const handleCloseQuestion = () =>
    dispatch({ type: 'feedback/reset/', payload: undefined });

  const handleAnswer = (answer: Answer) =>
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });

  return (
    <RN.View style={styles.tabBar}>
      <SafeAreaView style={styles.safeArea}>
        {state.routes.map((route, index) => {
          const testID = TabMap[index].testID;
          const isFocused = state.index === index;

          const [iconStyle, labelStyle] = isFocused
            ? [styles.selectedIcon, styles.selectedLabel]
            : [styles.icon, styles.label];

          const onTabPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <RN.View key={route.key} style={styles.container}>
              {index > 0 ? <RN.View style={styles.separator} /> : null}
              <RN.TouchableOpacity
                style={styles.tab}
                onPress={onTabPress}
                testID={testID}
              >
                {index === 2 ? <UnseenDot /> : null}
                <RN.Image style={iconStyle} source={TabMap[index].icon} />
                <RN.Text style={labelStyle}>{TabMap[index].text}</RN.Text>
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
      </SafeAreaView>
    </RN.View>
  );
};

const UnseenDot = () => {
  const isUnseen = ReactRedux.useSelector(isAnyMessageUnseen);

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
