import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import MentorListComponent from '../components/MentorList';
import Background from '../components/Background';
import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';
import Button from '../components/Button';
import Message from '../components/Message';
import CreatedBySosBanner from '../components/CreatedBySosBanner';

export type MentorListRoute = {
  'Onboarding/MentorList': {};
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/MentorList'>;

const MentorList = (props: Props) => {
  const navigateNext = () => {
    props.navigation.navigate('Onboarding/Sign', {});
  };

  return (
    <Background variant="secondary">
      <SafeAreaView
        style={styles.container}
        testID="onboarding.mentorlist.view"
      >
        <Message style={styles.title} id="onboarding.mentorlist.lowerTitle" />
        <MentorListComponent />
        <RN.View style={styles.bottom}>
          <Button
            style={styles.button}
            onPress={navigateNext}
            messageStyle={styles.buttonMessage}
            messageId="onboarding.mentorlist.start"
            badge={require('../images/arrow.svg')}
            testID="onboarding.mentorlist.start"
          />
          <CreatedBySosBanner style={styles.banner} />
        </RN.View>
      </SafeAreaView>
    </Background>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.darkestBlue,
  },
  bottom: {
    marginTop: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  button: { marginHorizontal: 24, alignSelf: 'stretch' },
  buttonMessage: {
    textAlign: 'center',
    ...fonts.titleBold,
    marginRight: 16,
  },
  banner: {
    marginTop: 16,
    marginBottom: 8,
  },
});

export default MentorList;
