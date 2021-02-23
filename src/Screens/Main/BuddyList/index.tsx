import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import * as navigationProps from '../../../lib/navigation-props';

import * as buddyState from '../../../state/reducers/buddies';
import * as messageState from '../../../state/reducers/messages';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';
import RemoteData from '../../components/RemoteData';
import TitledContainer from '../../components/TitledContainer';

import Button from './Button';

import { ChatRoute } from '../Chat';

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

type Props = navigationProps.NavigationProps<BuddyListRoute, ChatRoute>;

export default ({ navigation }: Props) => {
  const buddies = useSelector(buddyState.getBuddies);
  const ordering = useSelector(messageState.getOrder);
  const both = RD.combine(buddies, ordering);
  const buddyList = RD.remoteData.map(both, ([buddyMapping, buddyOrder]) => {
    return Object.values(buddyMapping).sort(
      (a, b) => (buddyOrder[b.buddyId] || 0) - (buddyOrder[a.buddyId] || 0),
    );
  });
  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };
  return (
    <TitledContainer
      TitleComponent={
        <Message id="buddyList.title" style={styles.screenTitleText} />
      }
      color={colors.blue}
    >
      <RemoteData data={buddyList} fetchData={() => {}}>
        {value => (
          <RN.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            testID={'main.buddyList.view'}
          >
            {value.map(buddy => (
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
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
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
});
