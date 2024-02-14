import React from 'react';
import RN from 'react-native';

const AppTitle = (props: RN.ViewProps) => {
  return (
    <RN.View {...props}>
      <RN.Image
        source={require('../images/ylitse_banner.svg')}
        resizeMode="contain"
        style={styles.image}
      />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default AppTitle;
