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
  items?: Item[];
  testID?: string;
}

const DropDown: React.FC<Props> = ({ items }) => {
  const [isOpen, setOpen] = React.useState(false);
  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  function renderItem({ item }: { item: Item }) {
    return (
      <RN.TouchableOpacity style={styles.buttons} onPress={item.action}>
        <Message id={item.text}></Message>
      </RN.TouchableOpacity>
    );
  }

  return (
    <>
      <RN.TouchableOpacity style={styles.button} onPress={toggleOpen}>
        <RN.Image
          source={require('../images/search.svg')}
          style={styles.icon}
        />
      </RN.TouchableOpacity>
      {isOpen && (
        <RN.View style={styles.dropdown}>
          <RN.FlatList
            contentContainerStyle={styles.scrollContent}
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </RN.View>
      )}
    </>
  );
};

export default DropDown;

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  dropdown: {
    position: 'absolute',
    backgroundColor: colors.orange,
    zIndex: 10,
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
    elevation: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  buttons: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
  },
});
