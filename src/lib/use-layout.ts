import React from 'react';
import RN from 'react-native';
import { useIsKeyboardShown } from './use-is-keyboard-shown';

interface Layout {
  width: number;
  height: number;
}

export default function (
  keyboardShouldNotSetHeight = false,
): [Layout, (event: RN.LayoutChangeEvent) => void | undefined] {
  const [layout, setLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
  });

  const isKeyboardVisible = useIsKeyboardShown();

  const shouldSetHeight =
    keyboardShouldNotSetHeight && isKeyboardVisible ? false : true;

  const onLayout = (event: RN.LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ ...layout, width, ...(shouldSetHeight && { height }) });
  };

  return [layout, onLayout];
}
