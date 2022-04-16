import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';

import * as navigationProps from '../../../lib/navigation-props';

import * as buddyState from '../../../state/reducers/buddies';

import Button from '../BuddyList/Button';
import { ChatRoute } from '../Chat';
import { Title } from './Title';

import colors from '../../components/colors';
import RemoteData from '../../components/RemoteData';

export type ArchivedListRoute = {
  'Main/ArchivedList': {};
};

type Props = navigationProps.NavigationProps<ArchivedListRoute, ChatRoute>;

export default ({ navigation }: Props) => {
  const remoteBuddies = ReactRedux.useSelector(buddyState.getArchivedBuddies);

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <RN.TouchableOpacity style={styles.screen} activeOpacity={1}>
      <Title onPressBack={onPressBack} />
      <RemoteData data={remoteBuddies}>
        {buddies => (
          <RN.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            testID={'main.buddyList.view'}
          >
            {buddies.map(buddy => (
              <Button
                key={buddy.buddyId + '1'}
                style={styles.button}
                onPress={onPress}
                name={buddy.name}
                buddyId={buddy.buddyId}
              />
            ))}
          </RN.ScrollView>
        )}
      </RemoteData>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  button: { marginVertical: 16 },
  failBox: {
    tintColor: colors.danger,
    zIndex: 3,
  },
});
