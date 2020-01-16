// TODO add spinner for loading screen
// TODO add button for Failure screen to retry

import React from 'react';
import RN from 'react-native';

import * as remoteData from '../../lib/remote-data';
import assertNever from '../../lib/assert-never';

import Spinner from './Spinner';
import Button from './Button';
import Message from './Message';
import fonts from './fonts';
import colors, { gradients } from './colors';
import shadow, { textShadow } from './shadow';

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
      return <></>;
    case 'Loading':
      return (
        <RN.View style={styles.container}>
          <Spinner />
          <Message
            style={styles.loadingText}
            id="components.remoteData.loading"
          />
        </RN.View>
      );
    case 'Failure':
      return (
        <RN.View style={styles.errorCard}>
          <RN.Image
            style={styles.errorImage}
            source={require('../images/cog.svg')}
          />
          <Message
            style={styles.failureText}
            id="components.remoteData.loadingFailed"
          />
          <Button colors={gradients.pillBlue} onPress={fetchData}>
            <Message
              style={styles.retryButtonText}
              id="components.remoteData.retry"
            />
          </Button>
        </RN.View>
      );
    case 'Success':
      return <>{children(data.value)}</>;
    default:
      assertNever(data);
  }
}

const styles = RN.StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.deepBlue,
    ...fonts.largeBold,
  },
  errorCard: {
    ...shadow(7),
    borderRadius: 7,
    padding: 30,
    margin: 30,
    alignSelf: 'stretch',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorImage: {
    tintColor: colors.danger,
    marginBottom: 32,
  },
  failureText: {
    marginBottom: 32,
    color: colors.deepBlue,
    ...fonts.largeBold,
  },
  retryButtonText: {
    color: colors.white,
    ...fonts.largeBold,
    ...textShadow,
  },
});

export default RemoteData;
