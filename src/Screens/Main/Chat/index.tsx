import React from 'react';
import RN from 'react-native';

import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as selectors from '../../../state/selectors';
import * as mentorState from '../../../state/reducers/mentors';
import * as newMessageState from '../../../state/reducers/newMessage';
import {
  getMessagesByBuddyId,
  isLoadingBuddyMessages,
} from '../../../state/reducers/messages';
import * as actions from '../../../state/actions';

import * as navigationProps from '../../../lib/navigation-props';
import useLayout from '../../../lib/use-layout';

import Title from './Title';
import Input from './Input';
import { MemoizedMessageList } from './MessageList';
import DropDown from '../../components/DropDownMenu';
import { Dialog } from '../../components/Dialog';
import { dialogProperties, dropdownItems } from './chatProperties';

import colors from '../../components/colors';
import { BanAction } from 'src/api/buddies';
import { MentorCardExpandedRoute } from '../MentorCardExpanded';
import { Toast } from '../../components/Toast';

export type ChatRoute = {
  'Main/Chat': { buddyId: string };
};

type Props = navigationProps.NavigationProps<
  ChatRoute,
  ChatRoute & MentorCardExpandedRoute
>;

const Chat = ({ navigation }: Props) => {
  const goBack = () => {
    navigation.goBack();
  };

  const buddyId = navigation.getParam('buddyId');

  const messageList = ReactRedux.useSelector(getMessagesByBuddyId(buddyId));

  const isLoading = ReactRedux.useSelector(isLoadingBuddyMessages(buddyId));

  const sortedMessageList = React.useMemo(() => {
    return messageList.sort(({ sentTime: A }, { sentTime: B }) => A - B);
  }, [messageList]);

  const getPreviousMessages = (messageId: string) => {
    dispatch({
      type: 'messages/setPollingParams',
      payload: { type: 'OlderThan', buddyId, messageId },
    });
  };

  const mentor = ReactRedux.useSelector(mentorState.getMentorByUserId(buddyId));

  const isMessageSendFailed = ReactRedux.useSelector(
    newMessageState.getMessageSendFailed(buddyId),
  );

  const goToMentorCard = () => {
    if (mentor) {
      navigation.navigate('Main/MentorCardExpanded', {
        mentor,
        didNavigateFromChat: true,
      });
    }
  };

  type DialogState = { dialogOpen: boolean; dropdownOpen: boolean };

  const [dialogState, setDialogState] = React.useState<DialogState>({
    dialogOpen: false,
    dropdownOpen: false,
  });

  const [banAction, setBanAction] = React.useState<BanAction | undefined>();

  const [{ height }, onLayout] = useLayout();

  const keyboardViewBehaviour =
    RN.Platform.OS === 'ios' ? 'padding' : undefined;

  const buddyStatus = ReactRedux.useSelector(selectors.getBuddyStatus(buddyId));

  const dispatch = ReactRedux.useDispatch<redux.Dispatch<actions.Action>>();

  const getDraftMessage = () => {
    dispatch({ type: 'newMessage/store/read/start', payload: { buddyId } });
  };

  const setBanStatus = (banStatus: BanAction) => {
    dispatch({
      type: 'buddies/changeBanStatus/start',
      payload: { buddyId, banStatus },
    });
  };

  const handleBan = (banStatus: BanAction) => {
    setDialogState({ dropdownOpen: false, dialogOpen: false });
    goBack();
    setBanStatus(banStatus);
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
          style={[styles.dropdown, { top: height - 8 }]}
          items={dropdownItems[buddyStatus].map(item => ({
            ...item,
            onPress: () => {
              setDialogs('dialogOpen', true), setBanAction(item.action);
            },
          }))}
          testID={'main.chat.menu'}
          tintColor={colors.black}
        />
      )}
      {dialogState.dialogOpen && banAction && (
        <Dialog
          {...dialogProperties[banAction]}
          onPress={() => setBanStatus(banAction)}
          buttonId={'meta.ok'}
          onPressCancel={() => setDialogs('dialogOpen', false)}
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
  spinnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Chat;
