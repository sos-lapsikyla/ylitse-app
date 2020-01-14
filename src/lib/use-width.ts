import React from 'react';
import RN from 'react-native';

export default function(): [number, (event: RN.LayoutChangeEvent) => void] {
  const [width, setWidth] = React.useState(0);
  const onLayout = (event: RN.LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };
  return [width, onLayout];
}
