import React from 'react';
import * as RN from 'react-native';

import * as ReactRedux from 'react-redux';
import * as redux from 'redux';
import { selectFirstQuestion } from '../../state/reducers/questions';

import { selectIsVersionBigEnough } from '../../state/reducers/minimumVersion';
import { storeUrl } from '../../api/config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as actions from '../../state/actions';

import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { StackRoutes } from '..';
import { useRefetch } from '../../lib/use-refetch';
import { getClient } from '../../lib/isDevice';

import BuddyList, { BuddyListRoute } from './BuddyList';
import MentorList, { MentorListRoute } from './MentorList';
import Settings, { SettingsRoute } from './Settings';

import QuestionModal from '../components/QuestionModal';
import { Answer } from '../../api/feedback';
import { TabBar } from './TabBar';
import Modal from '../components/Modal';

export type TabsRoute = {
  'Main/Tabs': {
    initial?: 'Main/Settings' | 'Main/BuddyList' | 'Main/MentorList';
  };
};

export type TabRoutes = BuddyListRoute & MentorListRoute & SettingsRoute;

const Tab = createBottomTabNavigator<TabRoutes>();

type Props = {} & StackScreenProps<StackRoutes, 'Main/Tabs'>;

const Main = ({ navigation, route }: Props) => {
  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();
  const initialRouteName = route.params?.initial;
  const appClient = getClient();

  const isAppVersionBigEnough = ReactRedux.useSelector(
    selectIsVersionBigEnough(appClient),
  );

  const handleRefetchData = () => {
    dispatch({ type: 'feedback/getQuestions/start', payload: undefined });
    dispatch({ type: 'mentors/start', payload: undefined });
  };

  const feedbackQuestion = ReactRedux.useSelector(selectFirstQuestion);

  const handleCloseQuestion = () => {
    dispatch({ type: 'feedback/reset/', payload: undefined });
  };

  const handleAnswer = (answer: Answer) => {
    dispatch({ type: 'feedback/sendAnswer/start', payload: answer });
  };

  useRefetch({
    callback: handleRefetchData,
  });

  const openStore = () => RN.Linking.openURL(storeUrl);

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

  React.useEffect(() => {
    dispatch({ type: 'minimumVersion/get/start', payload: undefined });
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
      {!isAppVersionBigEnough && (
        <Modal
          modalType="danger"
          title="main.version.not.big.enough.title"
          messageId="main.version.not.big.enough.text"
          primaryButtonMessage="main.version.not.big.enough.button"
          onPrimaryPress={openStore}
        />
      )}
    </>
  );
};

export default Main;
