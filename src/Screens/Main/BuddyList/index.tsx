import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as actions from '../../../state/actions';

import * as navigationProps from '../../../lib/navigation-props';
import useLayout from '../../../lib/use-layout';

import * as buddyState from '../../../state/reducers/buddies';

import colors from '../../components/colors';
import RemoteData from '../../components/RemoteData';

import Button from './Button';

import { ChatRoute } from '../Chat';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { BannedListRoute } from '../BannedList';
import { Title } from './Title';
import { ArchivedListRoute } from '../ArchivedList';

export type BuddyListRoute = {
  'Main/BuddyList': {};
};

type Props = navigationProps.NavigationProps<
  BuddyListRoute,
  ChatRoute & BannedListRoute & ArchivedListRoute
>;

export default ({ navigation }: Props) => {
  const buddies = ReactRedux.useSelector(buddyState.getActiveBuddies);

  const [isDropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const [{ height }, onLayout] = useLayout();

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const navigateToList = (list: 'Main/ArchivedList' | 'Main/BannedList') => {
    navigation.navigate(list, {});
    setDropdownOpen(false);
  };

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const retryToken = () => {
    dispatch({ type: 'storage/readToken/start', payload: undefined });
  };

  const dropdownItems: DropDownItem[] = [
    {
      textId: 'main.chat.navigation.banned',
      onPress: () => navigateToList('Main/BannedList'),
    },
    {
      textId: 'main.chat.navigation.archived',
      onPress: () => navigateToList('Main/ArchivedList'),
    },
  ];

  return (
    <RN.TouchableOpacity
      activeOpacity={1}
      onPress={() => setDropdownOpen(false)}
      disabled={!isDropdownOpen}
      style={styles.screen}
    >
      <Title openDropdown={() => setDropdownOpen(true)} onLayout={onLayout} />
      {isDropdownOpen && (
        <DropDown
          style={[styles.dropdown, { top: height - 8 }]}
          items={dropdownItems}
          testID={'main.chat.menu'}
          tintColor={colors.black}
        />
      )}
      <RemoteData data={buddies} fetchData={retryToken}>
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
});
