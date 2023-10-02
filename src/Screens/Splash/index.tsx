import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import * as O from 'fp-ts/lib/Option';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as storage from '../../state/reducers/storage';
import * as token from '../../state/reducers/accessToken';
import * as actions from '../../state/actions';

import colors from '../components/colors';

export type SplashRoute = {
  Splash: {};
};

type Props = StackScreenProps<StackRoutes, 'Splash'>;

const Splash = ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  React.useEffect(() => {
    dispatch(storage.readToken);
  }, []);

  const readTokenState = useSelector(storage.getReadToken);
  const tokenState = useSelector(token.getToken);

  React.useEffect(() => {
    if (RD.isFailure(readTokenState)) {
      setTimeout(() => {
        navigation.replace('Onboarding/Welcome', {});
      }, 500);
    }
  }, [readTokenState]);

  React.useEffect(() => {
    if (O.isSome(tokenState)) {
      navigation.replace('Main/Tabs', {});
    }
  }, [tokenState]);

  return <RN.View style={styles.background} />;
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.purplePale,
    flex: 1,
  },
});

export default Splash;
