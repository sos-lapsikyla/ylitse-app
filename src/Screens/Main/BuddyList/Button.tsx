import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import { hasUnseen } from '../../../state/reducers/messages';

import Card from '../../components/Card';
import fonts from '../../components/fonts';
import getBuddyColor from '../../components/getBuddyColor';

type Props = {
  buddyId: string;
  name: string;
  onPress: (buddyId: string) => void | undefined;
} & RN.ViewProps;

const Button = ({ style, buddyId, name, onPress, ...viewProps }: Props) => {
  const onPressBuddy = () => onPress(buddyId);
  const hasNewMessages = useSelector(hasUnseen(buddyId));
  const color = getBuddyColor(buddyId);

  return (
    <Card style={[styles.button, style]} {...viewProps}>
      <RN.TouchableOpacity style={styles.content} onPress={onPressBuddy}>
        <RN.Text style={styles.nameText}>{name}</RN.Text>
        <RN.View style={[styles.blob, { backgroundColor: color }]}>
          {hasNewMessages ? <RN.View style={styles.newMessage} /> : null}
          <RN.Image source={require('../../images/balloon.svg')} />
        </RN.View>
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
