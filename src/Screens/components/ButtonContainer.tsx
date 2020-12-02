import React from 'react';
import RN from 'react-native';

import colors from './colors';
interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  testID?: string;
}

const ButtonContainer: React.FC<Props> = ({
  onPress,
  style,
  children,
  testID,
}) => {
  return (
    <RN.TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </RN.TouchableOpacity>
  );
};

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  container: {
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: colors.blue80,
  },
});

export default ButtonContainer;
