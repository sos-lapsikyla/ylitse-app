import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { selectClientVersions } from 'src/state/reducers/minimumVersion';

import * as actions from '../../state/actions';

import colors from '../components/colors';

export type VersionCheckRoute = {
  VersionCheck: {};
};

type Props = StackScreenProps<StackRoutes, 'VersionCheck'>;

const VersionCheck = ({ navigation }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  React.useEffect(() => {
    dispatch({ type: 'minimumVersion/get/start', payload: undefined });
  }, []);

  const versionState = useSelector(selectClientVersions);

  React.useEffect(() => {
    if (RD.isSuccess(versionState)) {
      navigation.replace('Splash', {});
    }
  }, [versionState]);

  return <RN.View style={styles.background} />;
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.purplePale,
    flex: 1,
  },
});

export default VersionCheck;
