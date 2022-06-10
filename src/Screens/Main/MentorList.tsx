import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../state/actions';

import * as mentorApi from '../../api/mentors';

import Background from '../components/Background';
import { textShadow } from '../components/shadow';
import MentorsTitleAndSearchButton from '../components/MentorsTitleAndSearchButton';
import MentorListComponent from '../components/MentorList';
import colors from '../components/colors';
import fonts from '../components/fonts';

import { MentorCardExpandedRoute } from './MentorCardExpanded';
import { SearchMentorRoute } from '../Main/SearchMentor';
import QuestionModal from '../components/QuestionModal';
import { selectFirstQuestion } from 'src/state/reducers/questions';
import { Question } from 'src/api/feedback';

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

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const question: Question = {
    titles: {
      fi: 'Oletko saanut apua mentorilta?',
      en: 'Have you received help from a mentor?',
    },
    answer: {
      type: 'yes-no',
      yes: {
        value: 1,
        labels: {
          fi: 'Kyllä olen',
          en: 'Yes, I have',
        },
      },
      no: {
        value: 0,
        labels: {
          fi: 'En ole',
          en: "No, I haven't",
        },
      },
    },
    answer_id: '914',
    id: '666',
  };

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
        {feedbackQuestion && <QuestionModal question={feedbackQuestion} />}
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
