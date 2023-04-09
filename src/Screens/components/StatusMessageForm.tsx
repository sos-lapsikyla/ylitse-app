import React from 'react';
import RN from 'react-native';

import colors from './colors';
import fonts from './fonts';
import { textShadow } from './shadow';

import InputField from './InputField';
import Button from './Button';

type Props = {
  statusMessage: string;
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
  onButtonPress: () => void;
  maxLength: number;
};

export default (props: Props) => {
  //github.com/facebook/react-native/issues/36494
  const [onChangeShield, setOnChangeShield] = React.useState(true);

  React.useEffect(() => {
    if (onChangeShield) {
      setTimeout(() => setOnChangeShield(false), 300);
    }
  }, []);

  const handleTextChange = (text: string) => {
    if (onChangeShield) {
      return;
    }

    props.setStatusMessage(text);
  };

  return (
    <>
      <InputField
        value={props.statusMessage}
        onChangeText={handleTextChange}
        maxLength={props.maxLength}
        multiline
        testID="main.settings.account.status.input"
      />
      <RN.Text style={styles.maxCharactersText}>
        {props.statusMessage.length}/{props.maxLength}
      </RN.Text>
      <Button
        style={styles.saveButton}
        messageStyle={styles.buttonText}
        onPress={props.onButtonPress}
        messageId="meta.save"
        testID="main.settings.account.status.save"
      />
    </>
  );
};

const styles = RN.StyleSheet.create({
  saveButton: {
    marginTop: 32,
    alignSelf: 'flex-start',
    minWidth: '70%',
    backgroundColor: colors.blue,
  },
  maxCharactersText: {
    alignSelf: 'flex-end',
    color: colors.blueGray,
  },
  buttonText: {
    ...fonts.largeBold,
    ...textShadow,
    color: colors.white,
  },
});
