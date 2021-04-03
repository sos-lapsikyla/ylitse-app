import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import colors from './colors';
import Message from './Message';

type Item = {
  text: localization.MessageId;
  action: () => void;
  id: string;
};

interface Props {
  items: Item[];
  testID?: string;
}

const DropDown: React.FC<Props> = ({ items }) => {
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
      <RN.TouchableOpacity style={styles.button} onPress={toggleOpen}>
        <RN.Image
          source={require('../images/search.svg')}
          style={styles.icon}
        />
      </RN.TouchableOpacity>
      <RN.Modal visible={isOpen} transparent onRequestClose={toggleOpen}>
        <RN.TouchableWithoutFeedback onPress={toggleOpen}>
          <RN.View style={RN.StyleSheet.absoluteFill}>
            <RN.View style={styles.dropdown}>
              {items.map(item => (
                <RN.TouchableOpacity
                  key={item.id}
                  style={styles.buttons}
                  onPress={() => itemActionAndCloseModal(item.action)}
                >
                  <Message id={item.text} />
                </RN.TouchableOpacity>
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
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.orange,
    zIndex: 1,
    right: 8,
    top: 64,
    width: '50%',
  },
  icon: {
    tintColor: colors.blueGray,
    height: 20,
    width: 20,
  },
  button: {
    position: 'absolute',
    right: 16,
  },
  buttons: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
  },
});
