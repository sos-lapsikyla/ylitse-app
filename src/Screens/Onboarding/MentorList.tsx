import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Background from '../components/Background';
import MentorCard from '../components/MentorCard';

const MentorList = () => (
  <Background>
    <SafeAreaView style={styles.container}>
      <MentorCard style={styles.card} />
    </SafeAreaView>
  </Background>
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignSelf: 'stretch',
  },
});

export default MentorList;
