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
}

const NamedInputField = ({
  name,
  isPasswordInput,
  style,
  inputStyle,
  labelStyle,
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

  return (
    <RN.View style={style}>
      <Message style={[styles.nameText, labelStyle]} id={name} />
      <RN.View>
        <RN.TextInput
          style={[
            styles.inputText,
            inputStyle,
            isFocused && styles.focusedBorder,
          ]}
          editable={true}
          secureTextEntry={isSecureText}
          {...textInputProps}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
        />
        {isPasswordInput ? (
          <RN.TouchableOpacity
            style={[styles.button]}
            onPress={toggleSecureText}
          >
            <RN.Image
              style={styles.icon}
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
  nameText: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
    marginBottom: 8,
  },
  inputContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
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
  focusedBorder: { borderWidth: 2 },
  button: {
    position: 'absolute',
    right: 16,
    width: 24,
    top: 0,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  icon: { height: 24, width: 24, tintColor: colors.purple },
});

export default NamedInputField;
