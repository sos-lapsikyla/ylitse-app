import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import colors from './colors';
import fonts from './fonts';
import Message from './Message';
import shadow from './shadow';

export type DropDownItem = {
  textId: localization.MessageId;
  onPress: () => void;
  specialRender?: {
    RenderItem: React.FC<SpecialItemProps & any>;
    props: Record<string, any>;
  };
};
export type SpecialItemProps = Omit<DropDownItem, 'specialRender'>;

type Props = {
  items: DropDownItem[];
  testID?: string;
  tintColor?: string;
  style: RN.StyleProp<RN.ViewStyle>;
};

const DropDown: React.FC<Props> = ({ items, style }) => {
  return (
    <RN.View style={[styles.dropdown, style]}>
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;

        const isFirstItem = index === 0;

        const commonStyles = [
          isFirstItem && {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
          !isLastItem && {
            borderBottomColor: colors.formBorderGray,
            borderBottomWidth: 1,
          },
          isLastItem && {
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
        ];

        return item.specialRender ? (
          <item.specialRender.RenderItem
            key={index}
            onPress={item.onPress}
            textId={item.textId}
            {...item.specialRender.props}
            style={commonStyles}
          />
        ) : (
          <RN.TouchableOpacity
            key={index}
            style={[styles.button, commonStyles]}
            onPress={item.onPress}
          >
            <Message id={item.textId} style={styles.text} />
          </RN.TouchableOpacity>
        );
      })}
    </RN.View>
  );
};

export default DropDown;

const styles = RN.StyleSheet.create({
  dropdown: {
    ...shadow(7),
    borderRadius: 16,
    backgroundColor: colors.white,
    borderColor: colors.purple,
    borderWidth: 2,
  },
  button: {
    padding: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 32,
  },
  text: {
    ...fonts.largeBold,
  },
});
