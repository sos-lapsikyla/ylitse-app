import React from 'react';
import RN from 'react-native';

import Button from '../../../components/Button';
import NamedInputField from '../../../components/NamedInputField';
import IconButton from '../../../components/IconButton';

type Props = {
  currentPassword: string;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  repeatedNewPassword: string;
  setRepeatedNewPassword: React.Dispatch<React.SetStateAction<string>>;
  onGoBack: () => void;
  onButtonPress: () => void;
  isOkay: boolean;
};

export default (props: Props) => {
  return (
    <RN.View style={styles.container}>
      <RN.View>
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.current"
          isPasswordInput={true}
          value={props.currentPassword}
          onChangeText={props.setCurrentPassword}
          testID="main.settings.account.password.current"
        />
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.new"
          isPasswordInput={true}
          value={props.newPassword}
          onChangeText={props.setNewPassword}
          testID="main.settings.account.password.new"
        />
        <NamedInputField
          style={styles.field}
          name="main.settings.account.password.repeat"
          isPasswordInput={true}
          value={props.repeatedNewPassword}
          onChangeText={props.setRepeatedNewPassword}
          testID="main.settings.account.password.repeat"
        />
      </RN.View>
      <RN.View style={styles.buttonContainer}>
        <IconButton
          badge={require('../../../images/chevron-left.svg')}
          badgeStyle={styles.badge}
          onPress={props.onGoBack}
          testID="main.settings.account.password.cancel"
        />
        <Button
          style={styles.button}
          onPress={props.onButtonPress}
          messageId="meta.save"
          disabled={!props.isOkay}
          testID="main.settings.account.password.save"
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
  field: {
    marginVertical: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  badge: {
    width: 32,
    height: 32,
  },
  button: {
    paddingHorizontal: 64,
  },
});
