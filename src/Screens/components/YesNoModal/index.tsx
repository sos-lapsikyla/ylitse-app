import React from 'react';
import * as RN from 'react-native';

import fonts from '../fonts';
import colors from '../colors';

import Card from '../Card';

type Props = {
  yesText: string;
  noText: string;
};

const borderRadius = 16;

export default ({ yesText, noText }: Props) => {
  return (
    <RN.Modal animationType="fade" transparent={true} visible={true}>
      <RN.View style={styles.background}>
        <Card style={styles.card}>
          <RN.View style={styles.titleContainer}>
            <RN.Image
              style={styles.close}
              source={require('../../images/close.svg')}
            />
            <RN.Text style={styles.titleText}>Onko kivaa?</RN.Text>
          </RN.View>
          <RN.View style={styles.cardContent}>
            <RN.View style={styles.textContainer}>
              <RN.Text style={styles.leftText}>{yesText}</RN.Text>

              <RN.Text style={styles.rightText}>{noText}</RN.Text>
            </RN.View>
          </RN.View>
        </Card>
      </RN.View>
    </RN.Modal>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.transparentBlack,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 8,
    borderRadius,
  },
  cardContent: {
    padding: 24,
  },
  titleContainer: {
    borderRadius,
    flexDirection: 'column',
    backgroundColor: colors.blue,
  },
  titleText: {
    ...fonts.large,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 12,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftText: {
    flex: 1,
    ...fonts.regular,
  },
  spacer: {
    flex: 1,
  },
  rightText: {
    flex: 1,
    ...fonts.regular,
    textAlign: 'right',
  },
  button: {
    marginTop: 24,
    alignSelf: 'center',
    minWidth: '40%',
  },
});
