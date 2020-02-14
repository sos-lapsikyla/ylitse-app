import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import fonts from '../../components/fonts';

import colors from '../../components/colors';

type Props = {};

const Input = (_: Props) => {
  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'always' }}>
      <RN.View style={styles.inputContainer}>
        <RN.TextInput
          style={styles.inputText}
          multiline={true}
          editable={true}
        />
      </RN.View>
      <RN.TouchableOpacity style={styles.send}>
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
    // marginBottom: 4,
  },
  sendIcon: {
    tintColor: colors.faintBlue,
    transform: [{ rotate: '45deg' }],
    width: 32,
    height: 32,
    marginRight: 4,
  },
});

export default Input;
