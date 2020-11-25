import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import Card from './Card';
import Spinner from './Spinner';
import Button from './Button';
import Message from './Message';
import fonts from './fonts';
import colors, { gradients } from './colors';
import { textShadow } from './shadow';

interface Props<E, A> {
  data: RD.RemoteData<E, A>;
  fetchData: () => void | undefined;
  children: (value: A) => React.ReactElement;
}

function RemoteData<E, A>({
  data,
  children,
  fetchData,
}: Props<E, A>): React.ReactElement {
  React.useEffect(() => {
    if (RD.isInitial(data)) {
      fetchData();
    }
  });
  return pipe(
    data,
    RD.fold(
      () => <></>,
      () => (
        <RN.View style={styles.container}>
          <Spinner />
          <Message
            style={styles.loadingText}
            id="components.remoteData.loading"
          />
        </RN.View>
      ),
      () => (
        <RN.View style={styles.container}>
          <Card style={styles.errorCard}>
            <RN.Image
              style={styles.errorImage}
              source={require('../images/cog.svg')}
            />
            <Message
              style={styles.failureText}
              id="components.remoteData.loadingFailed"
            />
            <Button
              gradient={gradients.pillBlue}
              onPress={fetchData}
              messageStyle={styles.retryButtonText}
              messageId="components.remoteData.retry"
            />
          </Card>
        </RN.View>
      ),
      (value) => <>{children(value)}</>,
    ),
  );
}

const styles = RN.StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.deepBlue,
    ...fonts.largeBold,
  },
  errorCard: {
    padding: 30,
    margin: 30,
    alignSelf: 'stretch',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
