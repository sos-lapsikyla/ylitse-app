import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  inputStyle?: RN.StyleProp<RN.TextStyle>;
}

const InputField = ({
  style,
  inputStyle,
  maxLength,
  multiline,
  numberOfLines,
  ...textInputProps
}: Props) => {
  return (
    <RN.View style={[styles.container, style]}>
      <RN.TextInput
        style={[styles.inputText, inputStyle]}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={true}
        {...textInputProps}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 16,
    marginVertical: 8,
  },
  inputText: {
    ...fonts.regular,
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: RN.Platform.OS === 'ios' ? 8 : undefined,
    borderColor: colors.purple,
    borderWidth: 1,
  },
});

export default InputField;
