import React from 'react';
import RN from 'react-native';

import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as array from 'fp-ts/lib/Array';

import * as api from '../../api/mentors';

import Button from './Button';
import Card from './Card';
import MentorTitle from './MentorTitle';
import Message from './Message';
import MentorStory from './MentorStory';
import Chip from './Chip';
import colors from './colors';
import getBuddyColor from './getBuddyColor';
import fonts from './fonts';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: api.Mentor;
  onPress?: (mentor: api.Mentor) => void | undefined;
}

const magicSkills = {
  Lastensuojelu: null,
  Italy: null,
};

const MentorCard: React.FC<Props> = ({ onPress, style, mentor }) => {
  const skillTitle = pipe(
    mentor.skills,
    array.filter(name => name in magicSkills),
    array.head,
    O.toUndefined,
  );

  const skills = pipe(
    mentor.skills,
    array.filter(name => !(name in magicSkills)),
    array.takeLeft(3),
  );

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
        {skillTitle ? (
          <RN.View style={styles.chipContainer}>
            <Message
              style={styles.subtitle}
              id="components.mentorSkills.subject"
            />
            <Chip color={color} name={skillTitle} />
          </RN.View>
        ) : null}
        <Message style={styles.subtitle} id="components.mentorSkills.other" />
        <RN.View style={styles.chipContainer}>
          {skills.map(name => (
            <Chip key={name} color={color} name={name} />
          ))}
        </RN.View>
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
