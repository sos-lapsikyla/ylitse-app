import React from 'react';
import RN from 'react-native';
import * as api from '../../api/mentors';

import colors from './colors';
import fonts from './fonts';

import Button from './Button';
import Card, { cardBorderRadius } from './Card';
import MentorTitle from './MentorTitle';
import MentorStory from './MentorStory';
import Skills from './Skills';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: api.Mentor;
  onPress?: (mentor: api.Mentor) => void | undefined;
}

const MentorCard: React.FC<Props> = ({ onPress, style, mentor }) => {
  return (
    <Card style={[styles.card, style]}>
      <MentorTitle mentor={mentor} withStatus={true} />
      <RN.Image
        style={styles.topGradient}
        source={require('../images/gradient.svg')}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      <RN.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={'components.mentorCard.view'}
      >
        <MentorStory
          style={styles.story}
          story={mentor.story}
          showAll={false}
        />
        <Skills skills={mentor.skills} color={colors.whiteBlue} amount={100} />
      </RN.ScrollView>
      <RN.Image
        style={styles.bottomGradient}
        source={require('../images/gradient.svg')}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      {!onPress ? null : (
        <RN.View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            messageId="components.mentorCard.readMore"
            testID="components.mentorCard.readMore"
            onPress={() => onPress(mentor)}
          />
        </RN.View>
      )}
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  topGradient: {
    height: 40,
    tintColor: colors.white,
    marginBottom: -40,
    width: '100%',
    alignSelf: 'stretch',
    zIndex: 1,
  },
  bottomGradient: {
    height: 40,
    tintColor: colors.white,
    marginTop: -40,
    width: '100%',
    alignSelf: 'stretch',
    transform: [{ rotate: '180deg' }],
    zIndex: 1,
  },
  card: {
    overflow: 'hidden',
    zIndex: 2,
    justifyContent: 'space-between',
  },
  content: { flexShrink: 1 },
  contentContainer: {
    padding: 24,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  row: {
    marginTop: 24,
    marginBottom: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  subtitle: {
    marginRight: 16,
    ...fonts.regularBold,
    color: colors.darkestBlue,
  },
  chipContainer: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  story: {},
  buttonContainer: {
    zIndex: 2,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: cardBorderRadius,
    marginBottom: 8,
  },
  button: { minHeight: 40 },
});

export default MentorCard;
