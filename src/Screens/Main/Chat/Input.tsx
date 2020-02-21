import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import * as messageApi from '../../../api/messages';

import * as state from '../../../state';
import * as actions from '../../../state/actions';

import fonts from '../../components/fonts';
import colors from '../../components/colors';

type StateProps = {};

type DispatchProps = {
  sendMessage: (params: {
    buddyId: string;
    content: string;
  }) => void | undefined;
};

type OwnProps = {
  buddyId: string;
  style?: RN.StyleProp<RN.ViewStyle>;
};

type Props = OwnProps & StateProps & DispatchProps;

const Input = ({ buddyId, sendMessage }: Props) => {
  const [text, onChangeText] = React.useState('');
  const onSend = () => {
    sendMessage({ buddyId, content: text });
    onChangeText('');
  };
  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'always' }}>
      <RN.View style={styles.inputContainer}>
        <RN.TextInput
          style={styles.inputText}
          onChangeText={onChangeText}
          value={text}
          multiline={true}
          editable={true}
        />
      </RN.View>
      <RN.TouchableOpacity
        onPress={onSend}
        disabled={text === ''}
        style={styles.send}
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
    backgroundColor: colors.faintGray,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sendIcon: {
    tintColor: colors.faintBlue,
    transform: [{ rotate: '45deg' }],
    width: 32,
    height: 32,
    marginRight: 4,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(
  () => {
    return {};
  },
  (dispatch: redux.Dispatch<actions.Action>) => ({
    sendMessage: (params: messageApi.SendMessageParams) => {
      dispatch(actions.creators.sendMessage(params));
    },
  }),
)(Input);
