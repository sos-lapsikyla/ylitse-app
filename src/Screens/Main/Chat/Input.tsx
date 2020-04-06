import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as messageApi from '../../../api/messages';
import * as newMessageState from '../../../state/reducers/newMessage';

import * as actions from '../../../state/actions';

import fonts from '../../components/fonts';
import colors from '../../components/colors';
import getBuddyColor from '../../components/getBuddyColor';

type Props = {
  buddyId: string;
  style?: RN.StyleProp<RN.ViewStyle>;
};

export default ({ buddyId }: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  const sendMessage = (payload: messageApi.SendMessageParams) => {
    dispatch({ type: 'newMessage/send/start', payload });
  };

  const color = getBuddyColor(buddyId);

  const messageContent = useSelector(newMessageState.getText(buddyId));

  const storeMessage = (text: string) => {
    const payload = { text, buddyId };
    dispatch({ type: 'newMessage/store/write/start', payload });
  };

  const onSend = () => {
    sendMessage({ buddyId, text: messageContent });
  };
  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'always' }}>
      <RN.View style={styles.inputContainer}>
        <RN.TextInput
          style={styles.inputText}
          onChangeText={storeMessage}
          value={messageContent}
          multiline={true}
          editable={true}
        />
      </RN.View>
      <RN.TouchableOpacity
        onPress={onSend}
        disabled={messageContent === ''}
        style={[styles.send, { backgroundColor: color }]}
      >
        <RN.Image
          source={require('../../images/send.svg')}
          style={styles.sendIcon}
        />
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
    borderColor: colors.faintBlue,
    borderWidth: 1,
    borderRadius: 16,
  },
  inputText: {
    ...fonts.small,
    color: colors.deepBlue,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    textAlignVertical: 'top', // IOS/ANDROID
    marginTop: 14,
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
    tintColor: colors.deepBlue,
    transform: [{ rotate: '45deg' }],
    width: 32,
    height: 32,
    marginRight: 4,
  },
});
