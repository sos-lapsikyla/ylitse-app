// TODO add spinner for loading screen
// TODO add button for Failure screen to retry

import React from 'react';
import RN from 'react-native';

import * as remoteData from '../../lib/remote-data';
import assertNever from '../../lib/assert-never';

import Spinner from './Spinner';
import Message from './Message';
import fonts from './fonts';
import colors from './colors';

interface Props<A> {
  data: remoteData.RemoteData<A>;
  fetchData: () => void | undefined;
  children: (value: remoteData.Success<A>['value']) => React.ReactElement;
}

function RemoteData<A>({
  data,
  children,
  fetchData,
}: Props<A>): React.ReactElement {
  React.useEffect(() => {
    if (data.type === 'NotAsked') {
      fetchData();
    }
  });
  switch (data.type) {
    case 'NotAsked':
      return (
        <RN.View>
          <RN.Text>NotAsked</RN.Text>
        </RN.View>
      );
    case 'Loading':
      return (
        <RN.View style={styles.loadingScreen}>
          <Spinner />
          <Message
            style={styles.loadingText}
            id="components.remoteData.loading"
          />
        </RN.View>
      );
    case 'Failure':
      return (
        <RN.View>
          <RN.Text>Failure</RN.Text>
        </RN.View>
      );
    case 'Success':
      return <>{children(data.value)}</>;
    default:
      assertNever(data);
  }
}

const styles = RN.StyleSheet.create({
  loadingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.deepBlue,
    ...fonts.largeBold,
  },
});

export default RemoteData;
