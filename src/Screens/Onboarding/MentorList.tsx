import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Background from '../components/Background';
import MentorCard from '../components/MentorCard';
import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';

const MentorList = () => (
  <Background>
    <SafeAreaView style={styles.container}>
      <RN.Text style={styles.title1}>Meet our</RN.Text>
      <RN.Text style={styles.title2}>Mentors</RN.Text>
      <MentorCard style={styles.card} />
    </SafeAreaView>
  </Background>
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  card: {
    alignSelf: 'stretch',
  },
  title1: {
    ...fonts.title,
    ...textShadow,
    color: colors.white,
  },
  title2: {
    ...fonts.specialTitle,
    ...textShadow,
    color: colors.white,
  },
});

export default MentorList;
