import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import fonts from './fonts';
import Message from './Message';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  name: localization.MessageId;
  isPasswordInput?: boolean;
  inputStyle?: RN.StyleProp<RN.ViewStyle>;
  labelStyle?: RN.StyleProp<RN.TextStyle>;
  isError?: boolean;
}

const NamedInputField = ({
  name,
  isPasswordInput,
  style,
  inputStyle,
  labelStyle,
  isError = false,
  ...textInputProps
}: Props) => {
  const [isSecureText, setSecureText] = React.useState(
    false, // secureText will be enabled in the onFocus callback
  );
  const [isFocused, setIsFocused] = React.useState(false);

  const toggleSecureText = () => setSecureText(!isSecureText);

  const handleFocus = () => {
    isPasswordInput ? setSecureText(true) : () => {};

    setIsFocused(true);
  };

  const handleBlur = (
    e: RN.NativeSyntheticEvent<RN.TextInputFocusEventData>,
  ) => {
    setIsFocused(false);
    textInputProps?.onBlur && textInputProps.onBlur(e);
  };

  return (
    <RN.View style={style}>
      <Message style={[styles.nameText, labelStyle]} id={name} />
      <RN.View>
        <RN.TextInput
          style={[
            styles.inputText,
            inputStyle,
            isFocused && styles.focusedBorder,
            isError && styles.errorBorder,
          ]}
          editable={true}
          secureTextEntry={isSecureText}
          onFocus={handleFocus}
          {...textInputProps}
          onBlur={handleBlur}
        />
        {isPasswordInput ? (
          <RN.TouchableOpacity
            style={[styles.button]}
            onPress={toggleSecureText}
          >
            <RN.Image
              style={[
                styles.icon,
                { tintColor: isError ? colors.danger : colors.purple },
              ]}
              source={
                isSecureText
                  ? require('../images/eye-off-outline.svg')
                  : require('../images/eye-outline.svg')
              }
            />
          </RN.TouchableOpacity>
        ) : null}
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  nameText: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
    marginBottom: 8,
  },
  inputText: {
    ...fonts.regular,
    color: colors.darkestBlue,
    backgroundColor: colors.white,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 4,
  },
  focusedBorder: {
    borderWidth: 2,
    margin: -1,
    backgroundColor: colors.whiteBlue,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  button: {
    position: 'absolute',
    right: 16,
    width: 24,
    top: 0,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  icon: { height: 24, width: 24 },
});

export default NamedInputField;
