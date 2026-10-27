import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../components/colors';
import shadow from '../components/shadow';

type Props = RN.ViewProps & {
  TitleComponent: React.ReactElement;
  color: string;
  backgroundColor?: string;
  onTitleLayout?: RN.ViewProps['onLayout'];
};

const TitledContainer: React.FC<Props> = ({
  color,
  TitleComponent,
  onLayout,
  onTitleLayout,
  backgroundColor = colors.background,
  children,
}) => {
  return (
    <RN.View
      style={[styles.background, { backgroundColor }]}
      onLayout={onLayout}
    >
      <SafeAreaView
        edges={['top']}
        onLayout={onTitleLayout}
        style={[styles.shadow, { backgroundColor: color }]}
      >
        {TitleComponent}
      </SafeAreaView>
      {children}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    flex: 1,
  },
  shadow: {
    ...shadow(7),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

export default TitledContainer;
