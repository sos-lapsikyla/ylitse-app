import React from 'react';
import RN from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

import * as localization from '../../localization';

import Button from './Button';
import Message from './Message';
import Card from './Card';
import colors, { gradients } from './colors';
import fonts from './fonts';
import shadow, { textShadow } from './shadow';
import MentorTitle from './MentorTitle';

import * as api from '../../api/mentors';

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
  skillNames: string[];
  style?: RN.StyleProp<RN.ViewStyle>;
}

const SkillList = (props: SkillListProps) => {
  const [isAllVisible, setIsAllVisible] = React.useState(false);
  const showAll = () => {
    setIsAllVisible(true);
  };

  const skills = isAllVisible ? props.skillNames : props.skillNames.slice(0, 3);

  const showMoreText = localization.translator('fi')(
    'components.mentorCard.showMore',
  );

  return (
    <RN.View style={[skillListStyles.container, props.style]}>
      {skills.map(name => (
        <Chip key={name} name={name} />
      ))}
      {isAllVisible ? null : (
        <RN.TouchableOpacity onPress={showAll}>
          <Chip gradient={gradients.acidGreen} name={showMoreText} />
        </RN.TouchableOpacity>
      )}
    </RN.View>
  );
};

const skillListStyles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    ...fonts.titleBold,
  },
});

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: api.Mentor;
  onPress?: () => void | undefined;
}

const MentorCard: React.FC<Props> = ({ onPress, style, mentor }) => {
  return (
    <Card style={style}>
      <MentorTitle mentor={mentor} />
      <RN.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Message style={styles.subtitle} id="components.mentorCard.aboutMe" />
        <RN.Text style={styles.bodyText} numberOfLines={5}>
          {mentor.story}
        </RN.Text>
        {mentor.skills.length === 0 ? null : (
          <>
            <Message
              style={styles.subtitle}
              id="components.mentorCard.iCanHelp"
            />
            <SkillList skillNames={mentor.skills} />
          </>
        )}
        {!onPress ? null : (
          <RN.View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              messageId="components.mentorCard.readMore"
              onPress={onPress}
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
  subtitle: {
    ...fonts.regularBold,
    color: colors.deepBlue,
    marginTop: 24,
    marginBottom: 8,
  },
  bodyText: {
    ...fonts.regular,
    color: colors.deepBlue,
  },
  buttonContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  button: { marginTop: 24 },
});

export default MentorCard;
