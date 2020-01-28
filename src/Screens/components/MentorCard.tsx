import React from 'react';
import RN from 'react-native';

import * as api from '../../api/mentors';

import Button from './Button';
import Card from './Card';
import MentorTitle from './MentorTitle';
import MentorSkills from './MentorSkills';
import MentorStory from './MentorStory';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: api.Mentor;
  onPress?: (mentor: api.Mentor) => void | undefined;
}

const MentorCard: React.FC<Props> = ({ onPress, style, mentor }) => {
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
        {mentor.skills.length === 0 ? null : (
          <MentorSkills skills={mentor.skills} />
        )}
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
  chipContainer: {
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
