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
}

const NamedInputField = ({
  name,
  isPasswordInput,
  style,
  inputStyle,
  ...textInputProps
}: Props) => {
  const [isSecureText, setSecureText] = React.useState(
    false, // secureText will be enabled in the onFocus callback
  );
  const toggleSecureText = () => setSecureText(!isSecureText);
  const enableSecureText = () => setSecureText(true);

  return (
    <RN.View style={style}>
      <Message style={styles.nameText} id={name} />
      <RN.View>
        <RN.TextInput
          style={[inputStyle, styles.inputText]}
          editable={true}
          secureTextEntry={isSecureText}
          {...textInputProps}
          onFocus={isPasswordInput ? enableSecureText : () => {}}
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
    ...fonts.regular,
    color: colors.deepBlue,
    marginBottom: 8,
  },
  inputContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    ...fonts.largeBold,
    color: colors.deepBlue,
    backgroundColor: colors.faintGray,
    alignSelf: 'stretch',
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    borderRadius: 16,
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
  icon: { height: 24, width: 24, tintColor: colors.deepBlue },
});

export default NamedInputField;
