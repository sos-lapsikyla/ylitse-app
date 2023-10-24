import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as actions from '../../../state/actions';
import {
  coolDownDuration,
  selectUserReportStatus,
} from 'src/state/reducers/userReport';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

import useLayout from '../../../lib/use-layout';

import * as buddyState from '../../../state/reducers/buddies';
import * as messagesState from '../../../state/reducers/messages';

import colors from '../../components/colors';
import RemoteData from '../../components/RemoteData';
import Button from './Button';
import { Title } from './Title';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { FolderType } from '../FolderedChats/folderedChatProperties';
import FolderItem from './FolderItem';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabRoutes } from '../Tabs';
import { Toast } from 'src/Screens/components/Toast';

export type BuddyListRoute = {
  'Main/BuddyList': undefined;
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabRoutes, 'Main/BuddyList'>,
  StackScreenProps<StackRoutes>
>;

export default ({ navigation }: Props) => {
  const buddies = ReactRedux.useSelector(buddyState.getActiveBuddies);

  const { isSuccess: isUserReportSuccess } = ReactRedux.useSelector(
    selectUserReportStatus,
  );

  const hasUnseenArchivedMessages = ReactRedux.useSelector(
    messagesState.hasUnseenMessagesOfStatus('archived'),
  );
  const [isDropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const [{ height }, onLayout] = useLayout();

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const navigateToList = (folderType: FolderType) => {
    navigation.navigate('Main/FolderedChats', { folderType });
    setDropdownOpen(false);
  };

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const retryToken = () => {
    dispatch({ type: 'storage/readToken/start', payload: undefined });
  };

  const dropdownItems: DropDownItem[] = [
    {
      textId: 'main.chat.navigation.banned',
      onPress: () => navigateToList('banned'),
    },
    {
      textId: 'main.chat.navigation.archived',
      onPress: () => navigateToList('archived'),
      specialRender: {
        RenderItem: FolderItem,
        props: {
          testID: 'main.chat.menuitem.archived.unseenDot',
          shouldShowUnseenBall: hasUnseenArchivedMessages,
        },
      },
    },
  ];

  return (
    <RN.TouchableOpacity
      activeOpacity={1}
      onPress={() => setDropdownOpen(false)}
      disabled={!isDropdownOpen}
      style={styles.screen}
    >
      <Title
        openDropdown={() => setDropdownOpen(true)}
        onLayout={onLayout}
        hasUnseenArchivedMessages={hasUnseenArchivedMessages}
      />
      {isDropdownOpen && (
        <DropDown
          style={[styles.dropdown, { top: height - 16 }]}
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
      {isUserReportSuccess && (
        <Toast
          toastType="success"
          duration={coolDownDuration}
          messageId="main.userreport.success.toast"
        />
      )}
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
