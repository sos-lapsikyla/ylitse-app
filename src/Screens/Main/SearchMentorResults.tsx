import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import * as mentorApi from '../../api/mentors';

import Message from '../components/Message';

import colors, { gradients } from '../components/colors';
import fonts from '../components/fonts';

import { MentorCardExpandedRoute } from './MentorCardExpanded';
import MentorListComponent from '../components/MentorList';
import TitledContainer from '../components/TitledContainer';
import { textShadow } from '../components/shadow';

export type SearchMentorResultsRoute = {
  'Main/SearchMentorResults': { skills: any };
};

type OwnProps = navigationProps.NavigationProps<
  SearchMentorResultsRoute,
  MentorCardExpandedRoute
>;

type Props = OwnProps;

const SearchMentorResults = ({ navigation }: Props) => {
  const skills = navigation.getParam('skills');

  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressMentor = (mentor: mentorApi.Mentor) => {
    navigation.navigate('Main/MentorCardExpanded', { mentor });
  };

  return (
    <TitledContainer
      TitleComponent={
        <RN.View style={styles.titleContainer}>
          <RN.TouchableOpacity
            style={styles.backButtonTouchable}
            onPress={onPressBack}
          >
            <RN.Image
              source={require('../images/chevron-left.svg')}
              style={styles.backButtonIcon}
            />
          </RN.TouchableOpacity>
          <Message id="main.searchMentor.title" style={styles.titleMessage} />
          <RN.View style={styles.titleBalancer} />
        </RN.View>
      }
      gradient={gradients.pillBlue}
    >
      <RN.View style={styles.results} />
      <MentorListComponent
        skills={skills}
        onPress={onPressMentor}
        testID="main.searchMentorResults.view"
      />
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  titleBalancer: {
    flex: 1,
  },
  titleMessage: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
    flex: 6,
  },
  backButtonIcon: {
    tintColor: colors.white,
    width: 48,
    height: 48,
  },
  backButtonTouchable: {
    marginRight: 0,
    marginTop: -8,
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  results: {
    marginTop: 20,
  },
});

export default SearchMentorResults;
