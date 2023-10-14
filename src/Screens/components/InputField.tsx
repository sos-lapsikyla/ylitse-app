import React from 'react';
import RN from 'react-native';

import { isDevice } from '../../lib/isDevice';

import fonts from './fonts';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  inputStyle?: RN.StyleProp<RN.TextStyle>;
  icon?: RN.ImageSourcePropType;
}

const InputField = ({
  style,
  inputStyle,
  maxLength,
  multiline,
  numberOfLines,
  icon,
  ...textInputProps
}: Props) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <RN.View
      style={[styles.container, style, isFocused && styles.focusedBorder]}
    >
      <RN.TextInput
        style={[styles.inputText, inputStyle]}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={true}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />

      {icon && (
        <RN.Image
          style={styles.icon}
          source={icon}
          resizeMode="stretch"
          resizeMethod="scale"
        />
      )}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlignVertical: 'center',
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  inputText: {
    ...fonts.regular,
    paddingVertical: isDevice('ios') ? 12 : 8,
    marginLeft: 16,
    flexGrow: 1,
  },
  focusedBorder: { borderWidth: 2 },
  icon: {
    tintColor: colors.purple,
    height: 24,
    width: 24,
    marginRight: 16,
  },
});

export default InputField;
