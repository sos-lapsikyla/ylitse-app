import React from 'react';
import RN from 'react-native';

import ButtonContainer from './ButtonContainer';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  text: string;
  textStyle?: RN.StyleProp<RN.TextStyle>;
}

export default ({ onPress, style, text, textStyle }: Props) => {
  return (
    <ButtonContainer onPress={onPress} style={style}>
      <RN.Text style={textStyle}>{text}</RN.Text>
    </ButtonContainer>
  );
};
