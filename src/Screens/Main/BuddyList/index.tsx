import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import * as navigationProps from '../../../lib/navigation-props';
import useLayout from '../../../lib/use-layout';

import * as buddyState from '../../../state/reducers/buddies';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import { textShadow } from '../../components/shadow';
import Message from '../../components/Message';
import RemoteData from '../../components/RemoteData';
import TitledContainer from '../../components/TitledContainer';

import Button from './Button';

import { ChatRoute } from '../Chat';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { BannedListRoute } from './BannedList';

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

type Props = navigationProps.NavigationProps<
  BuddyListRoute,
  ChatRoute & BannedListRoute
>;

export default ({ navigation }: Props) => {
  const buddies = useSelector(buddyState.getActiveBuddies);

  const [isDropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const [{ height }, onLayout] = useLayout();

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const navigateToBanned = () => {
    navigation.navigate('Main/BuddyList/BannedList', {});
    setDropdownOpen(false);
  };

  const items: DropDownItem[] = [
    { textId: 'main.chat.navigation.banned', onPress: navigateToBanned },
  ];
  return (
    <TitledContainer
      onTitleLayout={onLayout}
      TitleComponent={
        <RN.View style={styles.header}>
          <RN.View style={styles.spacer} />
          <Message id="buddyList.title" style={styles.screenTitleText} />
          <RN.TouchableHighlight
            style={styles.kebab}
            onPress={() => setDropdownOpen(!isDropdownOpen)}
            underlayColor={colors.faintBackground}
            testID={'main.buddylist.kebabicon'}
          >
            <RN.Image
              source={require('../../images/three-dot-menu.svg')}
              style={{ tintColor: colors.white }}
            />
          </RN.TouchableHighlight>
          {isDropdownOpen ? (
            <DropDown
              style={[styles.dropdown, { top: height - 8 }]}
              closeDropdown={() => setDropdownOpen(false)}
              items={items}
              testID={'main.buddylist.menu'}
            />
          ) : null}
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
  spacer: { height: 40, width: 40 },
  screenTitleText: {
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.white,
  },
  kebab: {
    height: 40,
    width: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBalancer: {},
  dropdown: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    justifyContent: 'space-around',
  },
});
