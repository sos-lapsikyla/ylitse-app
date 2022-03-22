import React from 'react';
import RN from 'react-native';

import colors from './colors';
import fonts from './fonts';
import shadow, { textShadow } from './shadow';

interface ChipProps extends RN.ViewProps {
  name: string;
  color?: string;
}

export default ({ name, style, color, ...viewProps }: ChipProps) => (
  <RN.View
    style={[
      chipStyles.chip,
      color ? { backgroundColor: color } : undefined,
      style,
    ]}
    {...viewProps}
  >
    <RN.Text style={chipStyles.nameText}>{name}</RN.Text>
  </RN.View>
);

const chipStyles = RN.StyleSheet.create({
  chip: {
    ...shadow(),
    backgroundColor: colors.lighterBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    alignSelf: 'baseline',
    paddingTop: 2,
    paddingBottom: 3,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  nameText: {
    ...textShadow,
    ...fonts.smallBold,
    color: colors.deepBlue,
  },
});
