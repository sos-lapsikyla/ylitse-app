import React from 'react';
import RN from 'react-native';

import fonts from './fonts';
import colors from './colors';

import Card from './Card';
import Message from './Message';
import Button from './Button';

interface Props {
  fetchData?: () => void;
  style?: RN.StyleProp<RN.ViewStyle>;
}

const RemoteError: React.FC<Props> = ({ fetchData, style }) => {
  return (
    <Card style={[styles.errorCard, style]}>
      <RN.View style={styles.textContainer}>
        <RN.Image
          style={styles.errorImage}
          source={require('../images/error_icon.svg')}
        />
        <Message
          style={styles.failureText}
          id="components.remoteData.loadingFailed"
        />
      </RN.View>
      {fetchData ? (
        <RN.View style={styles.buttonContainer}>
          <Button
            onPress={fetchData}
            messageStyle={styles.retryButtonText}
            messageId="components.remoteData.retry"
            style={styles.retryButton}
          />
        </RN.View>
      ) : null}
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  errorCard: {
    padding: 24,
    margin: 24,
    alignSelf: 'stretch',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.pink,
    borderRadius: 16,
  },
  textContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  errorImage: {
    tintColor: colors.danger,
  },
  failureText: {
    marginLeft: 24,
    color: colors.darkestBlue,
    ...fonts.large,
  },
  buttonContainer: {
    width: '100%',
  },
  retryButton: {
    backgroundColor: colors.red,
    alignSelf: 'center',
    minWidth: '70%',
  },
  retryButtonText: {
    color: colors.darkestBlue,
    ...fonts.regularBold,
  },
});
export default RemoteError;
