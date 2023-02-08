import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';
import { selectFirstQuestion } from '../../state/reducers/questions';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import BuddyList, { BuddyListRoute } from './BuddyList';
import MentorList, { MentorListRoute } from './MentorList';
import Settings, { SettingsRoute } from './Settings';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';
import { TabBar } from './TabBar';

export type TabsRoute = { 'Main/Tabs': {} };

type TabRoutes = BuddyListRoute & MentorListRoute & SettingsRoute;

const Tab = createBottomTabNavigator<TabRoutes>();

type Props = {
  labels: string[];
  icons: RN.ImageSourcePropType[];
  testIDs: string[];
} & StackScreenProps<StackRoutes, 'Main/Tabs'>;

const Main = ({ navigation }: Props) => {
  const dispatch = ReactRedux.useDispatch();

  const handleRefetchData = () => {
    dispatch({ type: 'feedback/getQuestions/start', payload: undefined });
    dispatch({ type: 'mentors/start', payload: undefined });
  };
  const feedbackQuestion = ReactRedux.useSelector(selectFirstQuestion);

  const handleCloseQuestion = () =>
    dispatch({ type: 'feedback/reset/', payload: undefined });

  const handleAnswer = (answer: Answer) =>
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });

  React.useEffect(() => {
    const subscription = navigation.addListener('focus', () =>
      handleRefetchData(),
    );

    return subscription;
  }, [navigation]);

  return (
    <>
      <Tab.Navigator tabBar={props => <TabBar {...props} />}>
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
