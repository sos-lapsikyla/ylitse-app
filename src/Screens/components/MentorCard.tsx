import React from 'react';
import RN from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

import * as localization from '../../localization';

import Message from './Message';
import Card, { cardBorderRadius } from './Card';
import colors, { gradients } from './colors';
import fonts from './fonts';
import shadow, { textShadow } from './shadow';

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
}

const MentorCard: React.FC<Props> = ({
  children,
  style,
  mentor: { age, name, story, region, skills },
}) => {
  const gradientMap: { [i: number]: string[] } = {
    0: gradients.teal,
    1: gradients.pink,
    2: gradients.orange,
  };
  const gradient: string[] = gradientMap[name.length % 3];
  return (
    <Card style={style}>
      <LinearGradient style={styles.blob} colors={gradient}>
        <RN.Image
          source={require('../images/user.svg')}
          style={styles.userIcon}
        />
        <RN.View style={styles.column}>
          <RN.Text style={styles.name}>{name}</RN.Text>
          <RN.Text style={styles.infoText}>
            <RN.Text>{age}</RN.Text>
            <Message id={'components.mentorCard.yearsAbbrev'} /> {' | '}
            <RN.Text>{region}</RN.Text>
          </RN.Text>
        </RN.View>
      </LinearGradient>
      <RN.ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Message style={styles.subtitle} id="components.mentorCard.aboutMe" />
        <RN.Text style={styles.bodyText} numberOfLines={5}>
          {story}
        </RN.Text>
        {skills.length === 0 ? null : (
          <>
            <Message
              style={styles.subtitle}
              id="components.mentorCard.iCanHelp"
            />
            <SkillList skillNames={skills} />
          </>
        )}
        {children}
      </RN.ScrollView>
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  blob: {
    borderRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
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
  name: {
    ...fonts.titleBold,
  },
  infoText: {
    ...fonts.small,
  },
  content: { flexShrink: 1 },
  contentContainer: {
    padding: 24,
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
});

export default MentorCard;
