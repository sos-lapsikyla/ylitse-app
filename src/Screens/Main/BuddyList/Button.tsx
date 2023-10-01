import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import {
  getLastMessageByBuddyId,
  hasUnseen,
} from '../../../state/reducers/messages';
import { getMentorByUserId } from '../../../state/reducers/mentors';

import Card from '../../components/Card';
import fonts from '../../components/fonts';
import colors from '../../components/colors';

type Props = {
  buddyId: string;
  name: string;
  onPress: (buddyId: string) => void | undefined;
} & RN.ViewProps;

const Button = ({ style, buddyId, name, onPress, ...viewProps }: Props) => {
  const onPressBuddy = () => onPress(buddyId);
  const hasNewMessages = useSelector(hasUnseen(buddyId));
  const mentor = useSelector(getMentorByUserId(buddyId));
  const lastMessage = useSelector(getLastMessageByBuddyId(buddyId));

  return (
    <Card style={[styles.button, style]} {...viewProps}>
      <RN.TouchableOpacity style={styles.content} onPress={onPressBuddy}>
        <RN.View style={styles.textContainer}>
          <RN.Text
            style={styles.nameText}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {name}
          </RN.Text>
          <RN.Text
            style={styles.messageText}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {lastMessage}
          </RN.Text>
        </RN.View>
        <RN.View style={[styles.blob]}>
          {hasNewMessages ? (
            <RN.View
              style={styles.newMessage}
              testID={'main.buddyList.button.unseenDot'}
            />
          ) : null}
          {mentor?.is_vacationing ? (
            <RN.Image
              source={require('../../images/umbrella-beach.svg')}
              style={[styles.icon, styles.vacationIcon]}
            />
          ) : (
            <RN.Image
              source={require('../../images/balloon.svg')}
              style={styles.icon}
            />
          )}
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
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nameText: {
    ...fonts.regularBold,
    marginLeft: 32,
  },
  messageText: {
    ...fonts.small,
    marginLeft: 32,
  },
  blob: {
    borderRadius: 32,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    minHeight: 80,
    backgroundColor: colors.purplePale,
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
  icon: {
    tintColor: colors.purple,
  },
  vacationIcon: {
    width: 48,
    height: 48,
  },
});

export default Button;
