import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import colors from './colors';
import Message from './Message';

const AppTitle = (props: RN.ViewProps) => {
  return (
    <RN.View {...props}>
      <Message style={styles.title} id="components.appTitle.title" />
      <Message style={styles.subTitle} id="components.appTitle.subTitle" />
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  title: {
    ...fonts.specialTitleLarge,
    textAlign: 'center',
    color: colors.white,
  },
  subTitle: {
    marginTop: -32,
    ...fonts.title,
    textAlign: 'center',
    color: colors.white,
  },
});

export default AppTitle;
