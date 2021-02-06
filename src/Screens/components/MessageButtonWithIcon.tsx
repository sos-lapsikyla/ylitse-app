import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';
import ButtonContainer from './ButtonContainer';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  testID?: string;
}

 const FilterButton: React.FC<Props> = ({ onPress, style, children, testID }) => {
  return (
    <ButtonContainer
      style={[styles.container, style]}
      onPress={onPress}
      testID={testID}
    >
        <RN.Image
          style={styles.icon}
          source={require('../images/search.svg')}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        {children}
    </ButtonContainer>
  );
};

export default FilterButton;

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  
  icon: {
    tintColor: colors.faintBlue,
    height: 20,
    width: 20,
  },
  container: {
    flexDirection: 'row',
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue80,
    marginLeft: 20,
    marginTop: 30,
  }
});
