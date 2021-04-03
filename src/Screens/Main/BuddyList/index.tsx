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
import DropDown from 'src/Screens/components/DropDownMenu3';
import { BannedListRoute } from './BannedList';

import * as localization from '../../../localization';

type Item = {
  text: localization.MessageId;
  action: () => void;
  id: string;
};

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

type Props = navigationProps.NavigationProps<
  BuddyListRoute,
  ChatRoute & BannedListRoute
>;

export default ({ navigation }: Props) => {
  const buddies = useSelector(buddyState.getActiveBuddies);

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const navigateToBanned = () => {
    navigation.navigate('Main/BuddyList/BannedList', {});
  };

  const items: Item[] = [
    { text: 'main.chat.navigation.banned', action: navigateToBanned, id: '1' },
    { text: 'main.chat.navigation.banned', action: navigateToBanned, id: '2' },
  ];
  return (
    <TitledContainer
      TitleComponent={
        <RN.View style={styles.header}>
          <Message id="buddyList.title" style={styles.screenTitleText} />
          <DropDown items={items} />
        </RN.View>
      }
      color={colors.blue}
    >
      <RemoteData data={buddies} fetchData={() => {}}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
