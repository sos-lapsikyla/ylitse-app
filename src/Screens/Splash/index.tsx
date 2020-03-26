import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import { MentorListRoute } from '../Onboarding/MentorList';
import { TabsRoute } from '../Main/Tabs';

export type SplashRoute = {
  Splash: {};
};

type Props = navigationProps.NavigationProps<
  SplashRoute,
  MentorListRoute & TabsRoute
>;

const Splash = ({ navigation }: Props) => {
  const navigateNext = () => {
    navigation.replace('Onboarding/MentorList', {});
  };

  React.useEffect(() => {
    navigateNext();
  }, []);
  return <RN.View />;
};

export default Splash;
