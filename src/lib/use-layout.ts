import React from 'react';
import RN from 'react-native';

interface Layout {
  width: number;
  height: number;
}

export default function(): [
  Layout,
  (event: RN.LayoutChangeEvent) => void | undefined,
] {
  const [layout, setLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
  });
  const onLayout = (event: RN.LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };
  return [layout, onLayout];
}
