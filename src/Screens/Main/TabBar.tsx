import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';
import { selectFirstQuestion } from '../../state/reducers/questions';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import * as localization from '../../localization';
import { isDevice } from '../../lib/isDevice';
import { isAnyMessageUnseen } from '../../state/reducers/messages';

import colors from '../components/colors';
import fonts from '../components/fonts';
import shadow from '../components/shadow';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';

type TabSettings = {
  iconSelected: RN.ImageSourcePropType;
  iconInactive: RN.ImageSourcePropType;
  text: string;
  testID: string;
};

const TabMap: Array<TabSettings> = [
  {
    iconSelected: require('../images/cog.svg'),
    iconInactive: require('../images/cog-thin.svg'),
    text: localization.trans('tabs.settings'),
    testID: 'tabs.settings',
  },
  {
    iconSelected: require('../images/users.svg'),
    iconInactive: require('../images/users-thin.svg'),
    text: localization.trans('tabs.mentors'),
    testID: 'tabs.mentors',
  },
  {
    iconSelected: require('../images/balloon.svg'),
    iconInactive: require('../images/balloon-thin.svg'),
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
      {state.routes.map((route, index) => {
        const testID = TabMap[index].testID;
        const isFocused = state.index === index;
        const iconKey = isFocused ? 'iconSelected' : 'iconInactive';

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
              <RN.Image style={iconStyle} source={TabMap[index][iconKey]} />
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    minHeight: 64,
    backgroundColor: colors.white,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: isDevice('ios') ? 20 : 8,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 56,
    width: 1,
    backgroundColor: colors.whiteBlue,
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
    color: colors.purple,
    marginTop: 4,
  },
  selectedLabel: {
    ...fonts.smallBold,
    lineHeight: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.darkestBlue,
    marginTop: 8,
  },
  icon: { tintColor: colors.purple },
  selectedIcon: { tintColor: colors.darkestBlue },
});
