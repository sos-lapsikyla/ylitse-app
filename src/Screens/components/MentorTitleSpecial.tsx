import React from 'react';
import RN from 'react-native';
import { useSelector } from 'react-redux';

import * as api from '../../api/mentors';
import * as tokenState from '../../state/reducers/accessToken';

import colors from './colors';
import fonts from './fonts';
import Message from './Message';

type Props = {
  mentor: api.Mentor;
};

export const MentorTitleSpecial: React.FC<Props> = ({
  mentor: { buddyId, is_vacationing },
}) => {
  const isMe = useSelector(tokenState.isMe(buddyId));

  const message = isMe
    ? 'main.mentor.special.you'
    : 'main.mentor.special.notAvailable';

  const shouldShow = isMe || is_vacationing;

  return shouldShow ? (
    <RN.View
      style={[
        styles.special,
        { backgroundColor: isMe ? colors.lightBlue : colors.whiteBlue },
      ]}
    >
      <Message id={message} style={styles.text} />
    </RN.View>
  ) : null;
};

const styles = RN.StyleSheet.create({
  special: {
    position: 'absolute',
    right: 40,
    top: 0,
    borderRadius: 4,
    padding: 8,
    zIndex: 10,
  },
  text: {
    ...fonts.smallBold,
    color: colors.darkestBlue,
  },
});
