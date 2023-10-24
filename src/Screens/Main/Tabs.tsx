import React from 'react';

import * as ReactRedux from 'react-redux';
import { selectFirstQuestion } from '../../state/reducers/questions';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { StackRoutes } from '..';
import { useRefetch } from 'src/lib/use-refetch';

import BuddyList, { BuddyListRoute } from './BuddyList';
import MentorList, { MentorListRoute } from './MentorList';
import Settings, { SettingsRoute } from './Settings';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';
import { TabBar } from './TabBar';

// import { questions } from 'e2e/fixtures/questions';

export type TabsRoute = {
  'Main/Tabs': {
    initial?: 'Main/Settings' | 'Main/BuddyList' | 'Main/MentorList';
  };
};

export type TabRoutes = BuddyListRoute & MentorListRoute & SettingsRoute;

const Tab = createBottomTabNavigator<TabRoutes>();

type Props = {} & StackScreenProps<StackRoutes, 'Main/Tabs'>;

const Main = ({ navigation, route }: Props) => {
  const dispatch = ReactRedux.useDispatch();

  const initialRouteName = route.params?.initial;

  const handleRefetchData = () => {
    dispatch({ type: 'feedback/getQuestions/start', payload: undefined });
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const feedbackQuestion = ReactRedux.useSelector(selectFirstQuestion);
  // const feedbackQuestion = {
  //   answer_id: 'moi',
  //   id: 'moi',
  //   titles: questions[1].rules.titles,
  //   answer: questions[1].rules.answer,
  // };

  const handleCloseQuestion = () => {
    dispatch({ type: 'feedback/reset/', payload: undefined });
  };

  const handleAnswer = (answer: Answer) => {
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });
  };

  useRefetch({
    callback: handleRefetchData,
  });

  React.useEffect(() => {
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => !r.name.includes('Onboarding'));

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  }, []);

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialRouteName ?? 'Main/MentorList'}
        screenOptions={{ headerShown: false }}
        tabBar={props => <TabBar {...props} />}
      >
        <Tab.Screen name="Main/Settings" component={Settings} />
        <Tab.Screen name="Main/MentorList" component={MentorList} />
        <Tab.Screen name="Main/BuddyList" component={BuddyList} />
      </Tab.Navigator>
      {feedbackQuestion && (
        <QuestionModal
          question={feedbackQuestion}
          onClose={handleCloseQuestion}
          onAnswer={handleAnswer}
        />
      )}
    </>
  );
};

export default Main;
