import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as messageApi from '../../../api/messages';
import * as newMessageState from '../../../state/reducers/newMessage';

import * as actions from '../../../state/actions';

import fonts from '../../components/fonts';
import colors from '../../components/colors';
import getBuddyColor from '../../components/getBuddyColor';

import { SafeAreaView } from 'react-navigation';
import Spinner from 'src/Screens/components/Spinner';

type Props = {
  buddyId: string;
  style?: RN.StyleProp<RN.ViewStyle>;
};

export default ({ buddyId }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const sendMessage = (payload: messageApi.SendMessageParams) => {
    dispatch({ type: 'newMessage/send/start', payload });
  };

  const { isPending, disableSending, messageContent } = useSelector(
    newMessageState.getMessage(buddyId),
  );

  const [showPending, setShowPending] = React.useState(isPending);

  const sendButtonColor = getBuddyColor(buddyId);

  const storeMessage = (text: string) => {
    const payload = { text, buddyId };
    dispatch({ type: 'newMessage/store/write/start', payload });
  };

  const onSend = () => {
    sendMessage({ buddyId, text: messageContent });
  };

  const inputContainerBg = showPending ? colors.lightestGray : colors.white;

  React.useEffect(() => {
    if (isPending) {
      const pendingTimeOut = setTimeout(() => setShowPending(true), 500);

      return () => clearTimeout(pendingTimeOut);
    } else {
      setShowPending(false);
    }
  }, [isPending]);

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'always' }}>
      <RN.View
        style={[styles.inputContainer, { backgroundColor: inputContainerBg }]}
      >
        <RN.TextInput
          style={[styles.inputText]}
          onChangeText={storeMessage}
          value={messageContent}
          multiline={true}
          editable={isPending ? false : true}
          testID="main.chat.input.input"
        />
      </RN.View>
      <RN.TouchableOpacity
        onPress={onSend}
        disabled={disableSending}
        style={[styles.send, { backgroundColor: sendButtonColor }]}
        testID={'main.chat.input.button'}
      >
        {showPending ? (
          <Spinner />
        ) : (
          <RN.Image
            source={require('../../images/send.svg')}
            style={styles.sendIcon}
          />
        )}
      </RN.TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 16,
    marginRight: 8,
    backgroundColor: colors.white,
    borderColor: colors.blueGray,
    borderWidth: 1,
    borderRadius: 16,
  },
  inputText: {
    ...fonts.small,
    color: colors.darkestBlue,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    textAlignVertical: 'top', // IOS/ANDROID
    marginTop: RN.Platform.OS === 'ios' ? 14 : undefined,
    marginBottom: 0,
    maxHeight: 300,
    padding: 16,
  },
  send: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sendIcon: {
    tintColor: colors.darkestBlue,
    transform: [{ rotate: '45deg' }],
    width: 32,
    height: 32,
    marginRight: 4,
  },
});
