import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as mentorApi from '../../api/mentors';

import Message from './Message';
import { cardBorderRadius } from './Card';
import colors from './colors';
import fonts from './fonts';
import getBuddyColor from './getBuddyColor';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: mentorApi.Mentor;
  onPress?: () => void | undefined;
  safeArea?: boolean;
};

const SafeAreaWrapper: React.FC<{}> = ({ children }) => (
  <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
    {children}
  </SafeAreaView>
);

const MentorTitle: React.FC<Props> = ({
  onPress,
  style,
  mentor: { age, name, region, buddyId },
  safeArea,
}) => {
  const Wrapper = safeArea ? SafeAreaWrapper : React.Fragment;
  const color = getBuddyColor(buddyId);

  return (
    <RN.View style={[styles.blob, { backgroundColor: color }, style]}>
      <Wrapper>
        {!onPress ? null : (
          <RN.TouchableOpacity
            style={styles.chevronButton}
            onPress={onPress}
            testID={'components.mentorTitle.chevronLeft'}
          >
            <RN.Image
              source={require('../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={require('../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.View style={styles.column}>
          <RN.View style={styles.nameContainer}>
            <RN.Text style={styles.name}>{name}</RN.Text>
          </RN.View>
          <RN.View style={styles.infoContainer}>
            <RN.Text style={styles.infoText}>
              <RN.Text> {age}</RN.Text>
              <Message id={'components.mentorCard.yearsAbbrev'} />
              <RN.Text>{' | '}</RN.Text>
              <RN.Text>{region}</RN.Text>
            </RN.Text>
          </RN.View>
        </RN.View>
      </Wrapper>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blob: {
    borderRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronButton: {
    marginRight: 16,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.black,
    width: 48,
    height: 48,
  },
  userIcon: {
    tintColor: colors.black,
    width: 64,
    height: 64,
  },
  column: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    flex: 1,
    ...fonts.titleBold,
  },
  infoContainer: { flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' },
  infoText: {
    textAlign: 'left',
    flex: 1,
    ...fonts.small,
  },
});

export default MentorTitle;
