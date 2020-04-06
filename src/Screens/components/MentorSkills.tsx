import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import Chip from './Chip';

interface SkillListProps extends RN.ViewProps {
  skills: string[];
  color: string;
  style?: RN.StyleProp<RN.ViewStyle>;
}

const MentorSkills = ({ skills, color, style }: SkillListProps) => {
  return (
    <RN.View style={[styles.container, style]}>
      <RN.View style={styles.skillsContainer}>
        {skills.map(name => (
          <Chip key={name} color={color} name={name} />
        ))}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {},
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    ...fonts.titleBold,
  },
});

export default MentorSkills;
