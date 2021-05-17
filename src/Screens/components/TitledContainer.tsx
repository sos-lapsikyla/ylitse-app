import React from 'react';
import RN from 'react-native';

import colors from '../components/colors';
import shadow from '../components/shadow';

type Props = RN.ViewProps & {
  TitleComponent: React.ReactElement;
  color: string;
  onTitleLayout?: RN.ViewProps['onLayout'];
};

const TitledContainer: React.FC<Props> = ({
  color,
  TitleComponent,
  onLayout,
  onTitleLayout,
  children,
}) => {
  return (
    <RN.View style={styles.background} onLayout={onLayout}>
      <RN.SafeAreaView
        onLayout={onTitleLayout}
        style={[styles.shadow, { backgroundColor: color }]}
      >
        {TitleComponent}
      </RN.SafeAreaView>
      {children}
    </RN.View>
  );
};
const styles = RN.StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
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
