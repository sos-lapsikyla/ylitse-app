import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch } from 'react-redux';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import shadow from '../../../components/shadow';

import * as actions from '../../../../state/actions';
import * as messageApi from '../../../../api/messages';

type Props = messageApi.Message;

const Message = ({
  content,
  sentTime,
  type,
  isSeen,
  buddyId,
  messageId,
}: Props) => {
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();
  React.useEffect(() => {
    if (!isSeen) {
      dispatch({
        type: 'messages/markSeen',
        payload: { buddyId, messageId },
      });
    }
  }, []);
  const bubbleStyle =
    type === 'Received' ? styles.leftBubble : styles.rightBubble;

  const addZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const date = new Date(sentTime);
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  const timeText = `${hours}:${minutes}`;
  return (
    <RN.View style={[bubbleStyle, styles.bubble]}>
      <RN.View>
        <RN.Text style={styles.text}>{content}</RN.Text>
      </RN.View>

      <RN.Text style={styles.timeText}>{timeText}</RN.Text>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  leftBubble: {
    borderTopRightRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  rightBubble: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: colors.faintGray,
    alignSelf: 'flex-end',
  },
  bubble: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...shadow(5),
  },
  text: {
    ...fonts.regular,
    marginBottom: 4,
    marginRight: 8,
  },
  timeText: {
    ...fonts.tiny,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
});

export default Message;
