import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import fonts from './fonts';
import Message from './Message';
import colors from './colors';

export interface Props extends RN.TextInputProps {
  name: localization.MessageId;
  isPasswordInput?: boolean;
}

const NamedInputField = ({ name, isPasswordInput, style }: Props) => {
  const [isSecureText, setSecureText] = React.useState(
    isPasswordInput || false,
  );
  const toggleSecureText = () => setSecureText(!isSecureText);

  return (
    <RN.View style={style}>
      <Message style={styles.nameText} id={name} />
      <RN.View>
        <RN.TextInput
          style={styles.inputText}
          editable={true}
          secureTextEntry={isSecureText}
        />
        {isPasswordInput ? (
          <RN.TouchableOpacity
            style={[styles.button]}
            onPress={toggleSecureText}
          >
            <RN.Image
              style={styles.icon}
              source={require('../images/eye.svg')}
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
