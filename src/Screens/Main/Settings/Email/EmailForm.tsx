import React from 'react';
import RN from 'react-native';

import { isRight } from 'fp-ts/lib/Either';

import { ValidEmail } from '../../../../lib/validators';

import Button from '../../../components/Button';
import colors from '../../../components/colors';
import NamedInputField from '../../../components/NamedInputField';

import Message from '../../../components/Message';
import IconButton from '../../../components/IconButton';

type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  onGoBack: () => void;
  onButtonPress: () => void;
};

export default (props: Props) => {
  const emailParsingResult = ValidEmail.decode(props.email);
  const isValidEmail = isRight(emailParsingResult);

  return (
    <RN.View style={styles.container}>
      <RN.View>
        <NamedInputField
          style={styles.field}
          name="main.settings.account.email.title"
          value={props.email}
          onChangeText={props.setEmail}
          testID="main.settings.account.email.input"
        />
        {isValidEmail ? null : (
          <Message
            style={styles.error}
            id="main.settings.account.email.invalid"
          />
        )}
      </RN.View>
      <RN.View style={styles.buttonContainer}>
        <IconButton
          badge={require('../../../images/chevron-left.svg')}
          badgeStyle={styles.badge}
          onPress={props.onGoBack}
          testID="main.settings.account.email.cancel"
        />
        <Button
          style={styles.button}
          onPress={props.onButtonPress}
          messageId="meta.save"
          testID="main.settings.account.email.save"
          disabled={!isValidEmail}
        />
      </RN.View>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  error: {
    color: colors.red,
    textAlign: 'center',
  },
  field: {
    marginVertical: 8,
  },
  badge: {
    width: 32,
    height: 32,
  },
  button: {
    minWidth: 200,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    gap: 24,
  },
});
