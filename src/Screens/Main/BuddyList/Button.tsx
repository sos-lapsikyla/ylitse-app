import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import { hasUnseen } from '../../../state/reducers/messages';

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
  const hasNewMessages = useSelector(hasUnseen(buddyId));
  return (
    <Card style={[styles.button, style]} {...viewProps}>
      <RN.TouchableOpacity style={styles.content} onPress={onPressBuddy}>
        <RN.Text style={styles.nameText}>{name}</RN.Text>
        <LinearGradient style={styles.blob} colors={gradients.green}>
          {hasNewMessages ? <RN.View style={styles.newMessage} /> : null}
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
  newMessage: {
    zIndex: 2,
    borderRadius: 8,
    width: 16,
    height: 16,
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'yellow',
  },
});

export default Button;
