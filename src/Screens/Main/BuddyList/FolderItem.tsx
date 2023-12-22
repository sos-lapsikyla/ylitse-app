import React from 'react';
import RN from 'react-native';

import { SpecialItemProps } from '../../components/DropDownMenu';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import Message from '../../components/Message';
import { UnseenDot } from 'src/Screens/components/UnseenDot';

type Props = SpecialItemProps & {
  shouldShowUnseenBall: boolean;
  testID: string;
};

export const FolderItem: React.FC<Props> = ({
  onPress,
  textId,
  shouldShowUnseenBall,
  testID,
}) => {
  return (
    <RN.TouchableOpacity style={styles.button} onPress={onPress}>
      <Message id={textId} style={styles.text} />
      <UnseenDot
        hasUnseen={shouldShowUnseenBall}
        style={styles.dot}
        testID={testID}
      />
    </RN.TouchableOpacity>
  );
};

export default FolderItem;

const styles = RN.StyleSheet.create({
  button: {
    padding: 16,
    paddingHorizontal: 32,
  },
  text: {
    ...fonts.largeBold,
    color: colors.purple,
  },
  dot: {
    borderColor: colors.purple,
    borderWidth: 2,
    width: 14,
    height: 14,
    transform: [{ translateX: 12 }, { translateY: 22 }],
  },
});
