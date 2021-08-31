import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  inputStyle?: RN.StyleProp<RN.ViewStyle>;
}

const InputField = ({
  style,
  inputStyle,
  numberOfLines,
  maxLength,
  ...textInputProps
}: Props) => {
  return (
    <RN.View style={style}>
      <RN.View>
        <RN.TextInput
          style={[inputStyle, styles.inputText]}
          maxLength={maxLength}
          multiline={true}
          numberOfLines={numberOfLines}
          editable={true}
          {...textInputProps}
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  inputText: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
    backgroundColor: colors.lightestGray,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderRadius: 16,
    textAlignVertical: 'top',
  },
});

export default InputField;
