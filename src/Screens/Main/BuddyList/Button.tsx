import React from 'react';
import RN from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../components/colors';
import Card from '../../components/Card';
import fonts from '../../components/fonts';

type Props = {
  buddyId: string;
  name: string;
  onPress: (buddyId: string) => void | undefined;
} & RN.ViewProps;

const Button = ({ style, buddyId, name, onPress, ...viewProps }: Props) => {
  const onPressBuddy = () => onPress(buddyId);
  return (
    <Card style={[styles.button, style]} {...viewProps}>
      <RN.TouchableOpacity style={styles.content} onPress={onPressBuddy}>
        <RN.Text style={styles.nameText}>{name}</RN.Text>
        <LinearGradient style={styles.blob} colors={gradients.green}>
          <RN.Image source={require('../../images/balloon.svg')} />
        </LinearGradient>
      </RN.TouchableOpacity>
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  button: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    flexGrow: 1,
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  nameText: {
    ...fonts.titleBold,
    marginLeft: 32,
    flex: 1,
  },
  blob: {
    borderRadius: 32,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    minHeight: 80,
  },
});

export default Button;
