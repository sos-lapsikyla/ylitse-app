import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import fonts from './fonts';
import Message from './Message';
import colors from './colors';

interface Props extends RN.ViewProps {
  name: localization.MessageId;
}

const InputField = ({ name, style, ...viewProps }: Props) => {
  return (
    <RN.View style={[styles.container, style]} {...viewProps}>
      <Message style={styles.nameText} id={name} />
      <RN.View style={styles.inputContainer}>
        <RN.TextInput style={styles.inputText} />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {},
  nameText: {
    ...fonts.regular,
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 16,
    backgroundColor: colors.faintGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputText: {
    ...fonts.largeBold,
  },
});

export default InputField;
