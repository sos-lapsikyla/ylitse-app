import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';

import Spinner from './Spinner';
import Message from './Message';
import RemoteError from './RemoteError';

import fonts from './fonts';
import colors from './colors';

interface Props<E, A> {
  data: RD.RemoteData<E, A>;
  fetchData?: () => void | undefined;
  children: (value: A) => React.ReactElement;
  errorStyle?: RN.StyleProp<RN.ViewStyle>;
}

function RemoteData<E, A>({
  data,
  children,
  fetchData,
  errorStyle,
}: Props<E, A>): React.ReactElement {
  React.useEffect(() => {
    if (RD.isInitial(data) && fetchData) {
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
      () => <RemoteError fetchData={fetchData} style={errorStyle} />,
      value => <>{children(value)}</>,
    ),
  );
}

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.darkestBlue,
    ...fonts.largeBold,
  },
});

export default RemoteData;
