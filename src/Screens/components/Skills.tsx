import React from 'react';
import RN from 'react-native';

import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as array from 'fp-ts/lib/Array';

import { topics } from '../../api/topic-storage';

import fonts from './fonts';
import Chip from './Chip';
import Message from './Message';
import colors from './colors';

interface SkillListProps extends RN.ViewProps {
  skills: string[];
  color: string;
  style?: RN.StyleProp<RN.ViewStyle>;
  amount?: number;
}

export default ({ skills, color, style, amount }: SkillListProps) => {
  const skillTitle = pipe(
    skills,
    array.filter(name => name in topics),
    array.head,
    O.toUndefined,
  );
  return (
    <RN.View style={[styles.container, style]}>
      {skillTitle ? (
        <RN.View style={styles.chipContainer}>
          <Message
            style={styles.subtitle}
            id="components.mentorSkills.subject"
          />
          <Chip color={color} name={skillTitle} />
        </RN.View>
      ) : null}
      <Message style={styles.lowerTitle} id="components.mentorSkills.other" />
      <RN.View style={styles.chipContainer}>
        {[...skills]
          .sort((a, b) => a.length - b.length)
          .slice(0, amount)
          .map(name => (
            <Chip key={name} color={color} name={name} />
          ))}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: { marginTop: 16 },
  subtitle: {
    marginRight: 16,
    ...fonts.regularBold,
    color: colors.deepBlue,
  },
  lowerTitle: {
    ...fonts.regularBold,
    color: colors.deepBlue,
  },
  chipContainer: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
