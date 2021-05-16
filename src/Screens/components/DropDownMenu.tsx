import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import colors from './colors';
import fonts from './fonts';
import Message from './Message';
import shadow from './shadow';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type DropDownItem = {
  textId: localization.MessageId;
  onPress: () => void;
};

interface Props {
  items: DropDownItem[];
  testID?: string;
  tintColor?: string;
  dropdownStyle: any;
}

const DropDown: React.FC<Props> = ({ items, dropdownStyle }) => {
  return (
    <RN.View style={[styles.dropdown, dropdownStyle]}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={item.onPress}
        >
          <Message id={item.textId} style={styles.text} />
        </TouchableOpacity>
      ))}
    </RN.View>
  );
};

export default DropDown;

const styles = RN.StyleSheet.create({
  dropdown: {
    ...shadow(7),
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: colors.lightestGray,
  },
  button: {
    padding: 16,
    backgroundColor: colors.lightestGray,
    paddingHorizontal: 32,
  },
  text: {
    ...fonts.largeBold,
  },
});
