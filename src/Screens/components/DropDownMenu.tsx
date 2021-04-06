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
};

interface Props {
  items: DropDownItem[];
  testID?: string;
}

const DropDown: React.FC<Props> = ({ items, testID }) => {
  const [isOpen, setOpen] = React.useState(false);
  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const itemActionAndCloseModal = (action: () => void) => {
    action();
    toggleOpen();
  };

  return (
    <>
      <RN.TouchableHighlight
        style={styles.button}
        onPress={toggleOpen}
        underlayColor={colors.darkBlue}
        testID={testID}
      >
        <RN.Image
          source={require('../images/three-dot-menu.svg')}
          style={styles.icon}
        />
      </RN.TouchableHighlight>
      <RN.Modal visible={isOpen} transparent onRequestClose={toggleOpen}>
        <RN.TouchableWithoutFeedback onPress={toggleOpen}>
          <RN.View style={RN.StyleSheet.absoluteFill}>
            <RN.View style={styles.dropdown}>
              {items.map((item, index) => (
                <RN.TouchableHighlight
                  key={index}
                  style={styles.buttons}
                  underlayColor={colors.lighterBlue}
                  onPress={() => itemActionAndCloseModal(item.onPress)}
                >
                  <Message id={item.textId} style={styles.text} />
                </RN.TouchableHighlight>
              ))}
            </RN.View>
          </RN.View>
        </RN.TouchableWithoutFeedback>
      </RN.Modal>
    </>
  );
};

export default DropDown;

const styles = RN.StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    tintColor: colors.white,
  },
  dropdown: {
    ...shadow(7),
    position: 'absolute',
    zIndex: 1,
    right: 8,
    top: 104,
    borderRadius: 8,
    paddingVertical: 16,
    backgroundColor: colors.lightestGray,
    width: '50%',
  },
  buttons: {
    padding: 16,
    backgroundColor: colors.lightestGray,
  },
  text: {
    ...fonts.largeBold,
  },
});
