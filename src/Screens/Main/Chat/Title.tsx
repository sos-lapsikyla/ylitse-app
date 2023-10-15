import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import * as ReactRedux from 'react-redux';
import * as state from '../../../state';
import * as selectors from '../../../state/selectors';
import { getMentorByUserId } from '../../../state/reducers/mentors';

import { isDevice } from '../../../lib/isDevice';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { cardBorderRadius } from '../../components/Card';

type StateProps = {
  name: string;
};

type DispatchProps = {};

type OwnProps = {
  style?: RN.StyleProp<RN.ViewStyle>;
  onPress: () => void | undefined;
  buddyId: string;
  onLayout: (e: RN.LayoutChangeEvent) => void | undefined;
  openDropdown: () => void | undefined;
  goToMentorCard: () => void | undefined;
};

type Props = OwnProps & DispatchProps & StateProps;

const Title: React.FC<Props> = ({
  style,
  onPress,
  name,
  buddyId,
  onLayout,
  openDropdown,
  goToMentorCard,
}) => {
  const mentor = useSelector(getMentorByUserId(buddyId));

  return (
    <RN.View
      onLayout={onLayout}
      style={[
        styles.blob,
        isDevice('ios') ? styles.iosPadding : styles.androidPadding,
        style,
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        {!onPress ? null : (
          <RN.TouchableOpacity
            style={styles.chevronButton}
            onPress={onPress}
            testID={'chat.back.button'}
          >
            <RN.Image
              source={require('../../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={
            mentor?.is_vacationing
              ? require('../../images/umbrella-beach.svg')
              : require('../../images/user.svg')
          }
          style={styles.userIcon}
        />
        {mentor?.status_message ? (
          <RN.Pressable style={styles.container} onPress={goToMentorCard}>
            <RN.Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {name}
            </RN.Text>
            <RN.Text
              style={styles.status}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {mentor?.status_message}
            </RN.Text>
          </RN.Pressable>
        ) : (
          <RN.Pressable onPress={goToMentorCard} style={styles.nameContainer}>
            <RN.Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {name}
            </RN.Text>
          </RN.Pressable>
        )}
        <RN.TouchableHighlight
          style={styles.kebabIconHighlight}
          onPress={openDropdown}
          underlayColor={colors.faintBackground}
          testID={'main.chat.title.kebabicon'}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <RN.Image
            source={require('../../images/three-dot-menu-chat.svg')}
            style={styles.kebabIcon}
          />
        </RN.TouchableHighlight>
      </SafeAreaView>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  blob: {
    minHeight: 80,
    borderBottomRightRadius: cardBorderRadius,
    borderBottomLeftRadius: cardBorderRadius,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
  },
  androidPadding: {
    paddingVertical: 16,
  },
  iosPadding: {
    paddingTop: 16,
  },
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chevronButton: {
    marginRight: 8,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.black,
    width: 32,
    height: 32,
  },
  userIcon: {
    tintColor: colors.black,
    width: 32,
    height: 32,
    marginRight: 8,
  },
  container: {
    flex: 1,
    height: 40,
    justifyContent: 'flex-start',
  },
  name: {
    ...fonts.regularBold,
    flex: 1,
    textAlignVertical: 'center',
    flexWrap: 'wrap',
  },
  nameContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  status: {
    ...fonts.statusTiny,
    flex: 1,
    flexWrap: 'wrap',
  },
  kebabIconHighlight: {
    padding: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kebabIcon: {
    tintColor: colors.black,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(({ mentors, buddies }, { buddyId }) => {
  return {
    name: selectors.getBuddyName(buddyId, buddies.buddies, mentors),
  };
})(Title);
