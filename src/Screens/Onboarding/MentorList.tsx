import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import { SafeAreaView } from 'react-navigation';

import * as remoteData from '../../lib/remote-data';
import * as api from '../../api/mentors';
import * as state from '../../state';

import Background from '../components/Background';
import MentorCard from '../components/MentorCard';
import colors from '../components/colors';
import fonts from '../components/fonts';
import { textShadow } from '../components/shadow';
import RemoteData from '../components/RemoteData';

const mentor = {
  id: '1234',
  age: 24,
  name: 'Matti-Pekka',
  story:
    'Hi! I am Matti from Perähikiä and Lorem Ipsum is simply dummy text of the printing and typesetting industry. Because...',
  region: 'Pasila, Helsinki',
};

interface StateProps {
  mentors: remoteData.RemoteData<Map<string, api.Mentor>>;
}

interface DispatchProps {
  fetchMentors: () => void | undefined;
}

interface OwnProps {}

interface Props extends StateProps, DispatchProps, OwnProps {}

const MentorList = (props: Props) => {
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <RN.Text style={styles.title1}>Meet our</RN.Text>
        <RN.Text style={styles.title2}>Mentors</RN.Text>
        <RemoteData data={props.mentors} fetchData={props.fetchMentors}>
          {_ => <MentorCard style={styles.card} mentor={mentor} />}
        </RemoteData>
      </SafeAreaView>
    </Background>
  );
};

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

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.State
>(
  ({ mentors }) => ({ mentors }),

  (dispatch: redux.Dispatch<state.Action>) => ({
    fetchMentors: () => {
      dispatch(state.actions.fetchMentors());
    },
  }),
)(MentorList);
