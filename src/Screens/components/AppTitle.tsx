import React from 'react';
import RN from 'react-native';

const AppTitle = (props: RN.ViewProps) => {
  return (
    <RN.View {...props}>
      <RN.Image source={require('../images/ylitse_banner.svg')} />
    </RN.View>
  );
};

export default AppTitle;
