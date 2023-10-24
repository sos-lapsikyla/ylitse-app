import React from 'react';
import RN from 'react-native';

import { SpecialItemProps } from '../../components/DropDownMenu';

import colors from '../../components/colors';
import fonts from '../../components/fonts';
import Message from '../../components/Message';

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
      {shouldShowUnseenBall && <RN.View style={styles.dot} testID={testID} />}
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
    zIndex: 2,
    borderRadius: 8,
    top: 22,
    left: 8,
    width: 16,
    height: 16,
    backgroundColor: colors.yellow,
    position: 'absolute',
  },
});
