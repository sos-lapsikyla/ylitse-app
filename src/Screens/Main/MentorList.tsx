import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../state/actions';
import { selectFirstQuestion } from '../../state/reducers/questions';

import * as mentorApi from '../../api/mentors';
import { Answer } from '../../api/feedback';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import MentorsTitleAndSearchButton from '../components/MentorsTitleAndSearchButton';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

import { MentorCardExpandedRoute } from './MentorCardExpanded';
import { SearchMentorRoute } from '../Main/SearchMentor';
import QuestionModal from '../components/QuestionModal';

export type MentorListRoute = {
  'Main/MentorList': {};
};

type OwnProps = navigationProps.NavigationProps<
  MentorListRoute,
  MentorCardExpandedRoute & SearchMentorRoute
>;
type Props = OwnProps;

const MentorList = (props: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const feedbackQuestion = useSelector(selectFirstQuestion);

  const onPressMentor = (mentor: mentorApi.Mentor) => {
    props.navigation.navigate('Main/MentorCardExpanded', {
      mentor,
      didNavigateFromChat: false,
    });

    dispatch({
      type: 'statRequest/start',
      payload: {
        name: 'open_mentor_profile',
        props: { mentor_id: mentor.mentorId },
      },
    });
  };

  const onPressSearchMentor = () => {
    props.navigation.navigate('Main/SearchMentor', {});
  };

  React.useEffect(() => {
    dispatch({ type: 'feedback/getQuestions/start', payload: undefined });
  }, []);

  const handleCloseQuestion = () =>
    dispatch({ type: 'feedback/reset/', payload: undefined });

  const handleAnswer = (answer: Answer) =>
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });

  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <MentorsTitleAndSearchButton
          id="main.mentorList.title"
          onPress={onPressSearchMentor}
        />
        <MentorListComponent onPress={onPressMentor} />
        <RN.View style={styles.bottomSeparator} />
        {feedbackQuestion && (
          <QuestionModal
            question={feedbackQuestion}
            onClose={handleCloseQuestion}
            onAnswer={handleAnswer}
          />
        )}
      </SafeAreaView>
    </Background>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    ...fonts.titleLarge,
    ...textShadow,
    color: colors.white,
  },
  bottomSeparator: {
    height: 96,
  },
});

export default MentorList;
