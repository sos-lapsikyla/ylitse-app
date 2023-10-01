import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as selectors from '../../../state/selectors';
import * as newMessageState from '../../../state/reducers/newMessage';
import * as tokenState from '../../../state/reducers/accessToken';
import * as actions from '../../../state/actions';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

import useLayout from '../../../lib/use-layout';

import Title from './Title';
import Input from './Input';
import { MemoizedMessageList } from './MessageList';
import DropDown, { DropDownItem } from '../../components/DropDownMenu';
import Modal from '../../components/Modal';
import { dialogProperties, changeChatStatusOptions } from './chatProperties';

import colors from '../../components/colors';
import { ChatStatus } from 'src/api/buddies';
import { Toast } from '../../components/Toast';
import { useSelector } from 'react-redux';

export type ChatRoute = {
  'Main/Chat': { buddyId: string };
};

type Props = StackScreenProps<StackRoutes, 'Main/Chat'>;

type DialogState = { dialogOpen: boolean; dropdownOpen: boolean };

const Chat = ({ navigation, route }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };

  const isMentor = useSelector(tokenState.isMentor);
  const buddyId = route.params?.buddyId;

  const { messageList, isLoading, mentor, isMessageSendFailed, buddyStatus } =
    ReactRedux.useSelector(selectors.getChatDataFor(buddyId));

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const sortedMessageList = React.useMemo(
    () => messageList.sort(({ sentTime: A }, { sentTime: B }) => A - B),
    [messageList],
  );

  const [dialogState, setDialogState] = React.useState<DialogState>({
    dialogOpen: false,
    dropdownOpen: false,
  });

  const [changeChatStatusAction, setChangeChatStatusAction] = React.useState<
    ChatStatus | undefined
  >();

  const [{ height }, onLayout] = useLayout();

  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;

  const getPreviousMessages = (messageId: string) => {
    dispatch({
      type: 'messages/setPollingParams',
      payload: { type: 'OlderThan', buddyId, messageId },
    });
  };

  const goToMentorCard = () => {
    if (mentor) {
      navigation.navigate('Main/MentorCardExpanded', {
        mentor,
        didNavigateFromChat: true,
      });
    }
  };

  const getDraftMessage = () => {
    dispatch({ type: 'newMessage/store/read/start', payload: { buddyId } });
  };

  const setChatStatus = (nextStatus: ChatStatus) => {
    dispatch({
      type: 'buddies/changeChatStatus/start',
      payload: { buddyId, nextStatus },
    });
  };

  const handleChangeChatStatus = (chatStatus: ChatStatus) => {
    setDialogState({ dropdownOpen: false, dialogOpen: false });
    goBack();
    setChatStatus(chatStatus);
  };

  const setDialogs = (key: keyof DialogState, show: boolean) => {
    setDialogState({ ...dialogState, [key]: show });
  };

  const resetSendMessage = () => {
    dispatch({ type: 'newMessage/send/reset', payload: buddyId });
  };

  React.useEffect(() => {
    if (isMessageSendFailed) {
      const resetAlertTimeOut = setTimeout(
        () => resetSendMessage(),
        newMessageState.coolDownDuration,
      );

      return () => clearTimeout(resetAlertTimeOut);
    }
  }, [isMessageSendFailed]);

  React.useEffect(() => {
    getDraftMessage();
  }, []);

  const chatStatusActions: Array<DropDownItem> = changeChatStatusOptions[
    buddyStatus
  ].map(item => ({
    ...item,
    onPress: () => {
      setDialogs('dialogOpen', true);
      setChangeChatStatusAction(item.nextStatus);
    },
  }));

  const reportAction: DropDownItem = {
    textId: 'main.chat.report',
    onPress: () => {
      setDialogs('dropdownOpen', false);
      navigation.navigate('Main/UserReport', { reportedId: buddyId });
    },
  };

  const dropDownItems = isMentor
    ? chatStatusActions
    : [...chatStatusActions, reportAction];

  return (
    <RN.TouchableOpacity
      style={styles.screen}
      activeOpacity={1}
      onPress={() => setDialogs('dropdownOpen', false)}
      disabled={!dialogState.dropdownOpen}
    >
      <Title
        style={styles.title}
        onPress={goBack}
        buddyId={buddyId}
        onLayout={onLayout}
        openDropdown={() => setDialogs('dropdownOpen', true)}
        goToMentorCard={goToMentorCard}
      />
      {dialogState.dropdownOpen && (
        <DropDown
          style={[styles.dropdown, { top: height - 16 }]}
          items={dropDownItems}
          testID={'main.chat.menu'}
          tintColor={colors.black}
        />
      )}
      {dialogState.dialogOpen && changeChatStatusAction && (
        <Modal
          {...dialogProperties[changeChatStatusAction]}
          primaryButtonMessage={'meta.ok'}
          secondaryButtonMessage={'meta.back'}
          onPrimaryPress={() => handleChangeChatStatus(changeChatStatusAction)}
          onSecondaryPress={() => setDialogs('dialogOpen', false)}
        />
      )}
      <RN.KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardViewBehaviour}
      >
        {isMessageSendFailed && (
          <Toast
            toastType="danger"
            duration={newMessageState.coolDownDuration}
            messageId="main.chat.send.failure"
          />
        )}
        <MemoizedMessageList
          messageList={sortedMessageList}
          getPreviousMessages={getPreviousMessages}
          isLoading={isLoading}
        />
        <Input style={styles.input} buddyId={buddyId} />
      </RN.KeyboardAvoidingView>
    </RN.TouchableOpacity>
  );
};

const styles = RN.StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: colors.lightestGray,
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  title: {},
  input: {
    marginTop: 8,
  },
});

export default Chat;
