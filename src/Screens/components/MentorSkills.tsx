import React from 'react';
import RN from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

import * as localization from '../../localization';
import Message from './Message';
import shadow, { textShadow } from './shadow';
import colors, { gradients } from './colors';
import fonts from './fonts';

interface ChipProps extends Omit<LinearGradientProps, 'colors'> {
  name: string;
  gradient?: string[];
}

const Chip = ({ name, gradient, ...linearGradientProps }: ChipProps) => (
  <LinearGradient
    style={chipStyles.chip}
    colors={gradient ? gradient : gradients.pillBlue}
    {...linearGradientProps}
  >
    <RN.Text style={chipStyles.nameText}>{name}</RN.Text>
  </LinearGradient>
);

const chipStyles = RN.StyleSheet.create({
  chip: {
    ...shadow(),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    alignSelf: 'baseline',
    paddingVertical: 2,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  nameText: {
    ...textShadow,
    ...fonts.smallBold,
    color: colors.white,
  },
});

interface SkillListProps extends RN.ViewProps {
  skills: string[];
  showAll?: boolean;
  style?: RN.StyleProp<RN.ViewStyle>;
}

const MentorSkills = (props: SkillListProps) => {
  const [isAllVisible, setIsAllVisible] = React.useState(!!props.showAll);
  const showAll = () => {
    setIsAllVisible(true);
  };

  const skills = isAllVisible ? props.skills : props.skills.slice(0, 3);

  const showMoreText = localization.translator('fi')(
    'components.mentorCard.showMore',
  );

  return (
    <RN.View style={[styles.container, props.style]}>
      <Message style={styles.subtitle} id="components.mentorSkills.title" />
      <RN.View style={[styles.skillsContainer]}>
        {skills.map(name => (
          <Chip key={name} name={name} />
        ))}
        {isAllVisible ? null : (
          <RN.TouchableOpacity onPress={showAll}>
            <Chip gradient={gradients.blue} name={showMoreText} />
          </RN.TouchableOpacity>
        )}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {},
  subtitle: {
    ...fonts.regularBold,
    color: colors.deepBlue,
    marginTop: 24,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    ...fonts.titleBold,
  },
});

export default MentorSkills;
