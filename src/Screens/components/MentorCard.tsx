import React from 'react';
import RN from 'react-native';

import * as api from '../../api/mentors';

import Button from './Button';
import Card from './Card';
import MentorTitle from './MentorTitle';
import MentorStory from './MentorStory';
import Skills from './Skills';
import colors from './colors';
import getBuddyColor from './getBuddyColor';
import fonts from './fonts';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: api.Mentor;
  onPress?: (mentor: api.Mentor) => void | undefined;
}

const MentorCard: React.FC<Props> = ({ onPress, style, mentor }) => {
  const color = getBuddyColor(mentor.buddyId);
  return (
    <Card style={style}>
      <MentorTitle mentor={mentor} />
      <RN.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <MentorStory
          style={styles.story}
          story={mentor.story}
          showAll={false}
        />
        <Skills skills={mentor.skills} color={color} amount={3} />
        {!onPress ? null : (
          <RN.View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              messageId="components.mentorCard.readMore"
              onPress={() => onPress(mentor)}
            />
          </RN.View>
        )}
      </RN.ScrollView>
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  content: { flexShrink: 1 },
  contentContainer: {
    padding: 24,
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
    color: colors.deepBlue,
  },
  chipContainer: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  story: {
    marginTop: 8,
  },
  buttonContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  button: { marginTop: 24 },
});

export default MentorCard;
