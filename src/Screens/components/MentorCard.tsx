import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Message from './Message';
import colors, { gradients } from './colors';
import fonts from './fonts';
import shadow, { textShadow } from './shadow';

const dummyText =
  'Hi! I am Matti from Perähikiä and Lorem Ipsum is simply dummy text of the printing and typesetting industry. Because...';

interface ChipProps {
  name: string;
}

const Chip = ({ name }: ChipProps) => (
  <LinearGradient style={chipStyles.chip} colors={gradients.pillBlue}>
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

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
}

const MentorCard: React.FC<Props> = ({ children, style }) => (
  <RN.View style={[styles.container, style]}>
    <LinearGradient
      style={styles.blob}
      colors={[colors.darkTeal, colors.lightTeal]}
    >
      <RN.Image
        source={require('../images/user.svg')}
        style={styles.userIcon}
      />
      <RN.View style={styles.column}>
        <RN.Text style={styles.name}>Matti-Pekka</RN.Text>
        <RN.Text>28 v. | Kuusamo, Perahikia </RN.Text>
      </RN.View>
    </LinearGradient>
    <RN.View style={styles.contentContainer}>
      <Message style={styles.subtitle} id="components.mentorCard.aboutMe" />
      <RN.Text style={styles.bodyText}>{dummyText}</RN.Text>
      <Message style={styles.subtitle} id="components.mentorCard.iCanHelp" />
      <RN.View style={styles.chipContainer}>
        <Chip name="Kela" />
        <Chip name="Drugs" />
        <Chip name="Vim" />
        <Chip name="React Native" />
        <Chip name="Design" />
      </RN.View>
      {children}
    </RN.View>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  container: { ...shadow(), borderRadius: 30, backgroundColor: colors.white },
  blob: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  userIcon: {
    tintColor: colors.black,
    width: 64,
    height: 64,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 24,
  },
  contentContainer: {
    padding: 24,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    ...fonts.titleBold,
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
