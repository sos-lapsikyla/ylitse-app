import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import * as messageApi from '../../../api/messages';
import * as newMessageState from '../../../state/reducers/newMessage';
import * as actions from '../../../state/actions';

import { isDevice } from '../../../lib/isDevice';

import fonts from '../../components/fonts';
import colors from '../../components/colors';

import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'src/Screens/components/Spinner';
import shadow from 'src/Screens/components/shadow';

type Props = {
  buddyId: string;
  style?: RN.StyleProp<RN.ViewStyle>;
};

export default ({ buddyId }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const sendMessage = (payload: messageApi.SendMessageParams) => {
    dispatch({ type: 'newMessage/send/start', payload });
  };

  const { isPending, isSendingDisabled, messageContent } = useSelector(
    newMessageState.getMessage(buddyId),
  );

  const storeMessage = (text: string) => {
    const payload = { text, buddyId };
    dispatch({ type: 'newMessage/store/write/start', payload });
  };

  const onSend = () => {
    sendMessage({ buddyId, text: messageContent });
  };

  const [showPending, setShowPending] = React.useState(isPending);

  React.useEffect(() => {
    if (isPending) {
      const pendingTimeOut = setTimeout(() => setShowPending(true), 500);

      return () => clearTimeout(pendingTimeOut);
    } else {
      setShowPending(false);
    }
  }, [isPending]);

  const inputContainerBg = showPending ? colors.background : colors.white;

  return (
    <SafeAreaView style={styles.container}>
      <RN.View
        style={[styles.inputContainer, { backgroundColor: inputContainerBg }]}
      >
        <RN.TextInput
          style={[styles.inputText]}
          onChangeText={storeMessage}
          value={messageContent}
          multiline={true}
          editable={!isPending}
          testID="main.chat.input.input"
        />
      </RN.View>
      <RN.TouchableOpacity
        onPress={onSend}
        disabled={isSendingDisabled}
        style={styles.send}
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
    borderColor: colors.formBorderGray,
    borderWidth: 2,
    borderRadius: 24,
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
    marginTop: isDevice('ios') ? 14 : undefined,
    marginBottom: 0,
    maxHeight: 300,
    padding: 16,
  },
  send: {
    display: 'flex',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: colors.purplePale,
    ...shadow(2),
  },
  sendIcon: {
    marginLeft: 4,
    tintColor: colors.purple,
    width: 36,
    height: 36,
  },
});
