import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Background from '../components/Background';
import Card from '../components/Card';

const MentorList = () => (
  <Background>
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <RN.Text>JANTERI</RN.Text>
      </Card>
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
