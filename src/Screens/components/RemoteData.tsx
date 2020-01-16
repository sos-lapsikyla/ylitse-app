// TODO add spinner for loading screen
// TODO add button for Failure screen to retry

import React from 'react';
import RN from 'react-native';

import * as remoteData from '../../lib/remote-data';
import assertNever from '../../lib/assert-never';

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
        <RN.View>
          <RN.Text>Loading</RN.Text>
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
export default RemoteData;
