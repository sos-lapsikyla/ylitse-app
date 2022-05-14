import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as actions from '../../../state/actions';
import * as RD from '@devexperts/remote-data-ts';

import useLayout from '../../../lib/use-layout';

import * as changeBanStatusState from '../../../state/reducers/changeChatStatus';

import Button from '../BuddyList/Button';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import { Dialog, DialogProps } from '../../components/Dialog';
import { Title } from './Title';

import colors from '../../components/colors';
import RemoteData from '../../components/RemoteData';
import { ChangeChatStatusAction } from 'src/api/buddies';
import { AlertModal } from 'src/Screens/components/AlertModal';
import { Props, listData } from './folderedChatProperties';

export default ({ navigation }: Props) => {
  const folderType = navigation.getParam('folderType');
  const { buddySelector, titleId } = listData[folderType];

  const remoteBuddies = ReactRedux.useSelector(buddySelector);

  const isBanRequestFailed = ReactRedux.useSelector(
    changeBanStatusState.selectBanRequestFailed,
  );

  type DialogState = { dialogOpen: boolean; dropdownOpen: boolean };

  const [dialogState, setDialogState] = React.useState<DialogState>({
    dropdownOpen: false,
    dialogOpen: false,
  });

  const [{ height }, onLayout] = useLayout();

  const onPress = (buddyId: string) => {
    navigation.navigate('Main/Chat', { buddyId });
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const handleBatchBan = (banStatus: ChangeChatStatusAction) => {
    setDialogState({ dropdownOpen: false, dialogOpen: false });

    if (RD.isSuccess(remoteBuddies) && remoteBuddies.value?.length) {
      const buddyIds = remoteBuddies.value.map(buddy => buddy.buddyId);
      dispatch({
        type: 'buddies/changeChatStatusBatch/start',
        payload: { buddyIds, banStatus },
      });
    }
  };

  const resetBanRequestState = () => {
    dispatch({ type: 'buddies/changeChatStatus/reset', payload: undefined });
  };

  const dialogProperties: Omit<DialogProps, 'onPressCancel' | 'buttonId'> = {
    textId: 'main.chat.deleteAll.confirmation',
    onPress: () => handleBatchBan('Delete'),
    type: 'danger',
  };

  const dropdownItems: DropDownItem[] = [
    {
      textId: 'main.chat.deleteAll',
      onPress: () => setDialogs('dialogOpen', true),
    },
  ];

  const setDialogs = (key: keyof DialogState, show: boolean) => {
    setDialogState({ ...dialogState, [key]: show });
  };

  return (
    <RN.TouchableOpacity
      style={styles.screen}
      activeOpacity={1}
      onPress={() => setDialogs('dropdownOpen', false)}
      disabled={!dialogState.dropdownOpen}
    >
      <Title
        openDropdown={() => setDialogs('dropdownOpen', true)}
        onLayout={onLayout}
        onPressBack={onPressBack}
        headerId={titleId}
      />
      {dialogState.dropdownOpen && (
        <DropDown
          style={[styles.dropdown, { top: height - 8 }]}
          items={dropdownItems}
          testID={'main.chat.menu'}
          tintColor={colors.black}
        />
      )}
      {dialogState.dialogOpen && (
        <Dialog
          {...dialogProperties}
          buttonId={'meta.ok'}
          onPressCancel={() => setDialogs('dialogOpen', false)}
        />
      )}
      {isBanRequestFailed ? (
        <AlertModal
          modalType="danger"
          messageId="main.chat.deleteAll.error"
          onSecondaryPress={resetBanRequestState}
          onPrimaryPress={() => handleBatchBan('Delete')}
        />
      ) : (
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
  failBox: {
    tintColor: colors.danger,
    zIndex: 3,
  },
});
