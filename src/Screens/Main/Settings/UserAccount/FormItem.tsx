import React from 'react';
import RN from 'react-native';

import { MessageId } from '../../../../localization';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import Message from '../../../components/Message';
import IconButton from '../../../components/IconButton';

type FormButton = {
  testID: string;
  onClick: () => void;
};

type Props = {
  labelMessageId: MessageId;
  button?: FormButton;
  style?: RN.StyleProp<RN.ViewStyle>;
  children: React.ReactNode;
};

export const FormItem = ({
  labelMessageId,
  button,
  children,
  style,
}: Props) => {
  return (
    <RN.View style={style ?? styles.dataContainer}>
      <RN.View style={styles.headerContainer}>
        <Message style={styles.fieldName} id={labelMessageId} />
        {button && (
          <IconButton
            badge={require('../../../images/pen.svg')}
            onPress={button.onClick}
            testID={button.testID}
            noShadow
          />
        )}
      </RN.View>
      {children}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  dataContainer: {
    paddingVertical: 16,
    borderBottomColor: colors.formBorderGray,
    borderBottomWidth: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  fieldName: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
  },
});
