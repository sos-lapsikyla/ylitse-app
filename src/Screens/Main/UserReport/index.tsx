import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';
import { selectUserReportStatus } from 'src/state/reducers/userReport';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../..';
import { ValidDescription } from 'src/lib/validators';
import { isRight } from 'fp-ts/lib/Either';

import { Title } from './Title';
import TitledContainer from 'src/Screens/components/TitledContainer';
import colors from 'src/Screens/components/colors';
import Button from 'src/Screens/components/Button';
import NamedInputField from 'src/Screens/components/NamedInputField';
import fonts from 'src/Screens/components/fonts';
import Message from '../../components/Message';
import { textShadow } from 'src/Screens/components/shadow';

export type UserReportRoute = {
  'Main/UserReport': { reportedId: string };
};

type Props = StackScreenProps<StackRoutes, 'Main/UserReport'>;

const UserReport = ({ navigation, route }: Props) => {
  const reportedId = route.params?.reportedId;

  const { isLoading, isSuccess } = ReactRedux.useSelector(
    selectUserReportStatus,
  );
  const dispatch = ReactRedux.useDispatch();
  const [description, setDescription] = React.useState('');
  const [isValidDescription, setIsValidDescription] = React.useState(true);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleReport = () => {
    dispatch({
      type: 'userReport/start',
      payload: {
        reportedId,
        description,
        contactEmail: 'asd@moi.fi',
        contactPhone: '0447766444',
        reportedMessageId: 'jsL8mJ_9hAbbs68jJsh4D4NDzPKD_K-fEnUX07PTLpY',
      },
    });
  };

  const checkIsDescriptionValid = () =>
    setIsValidDescription(isRight(ValidDescription.decode(description)));

  React.useEffect(() => {
    if (isSuccess) {
      navigation.replace('Main/Tabs', { initial: 'Main/BuddyList' });
    }
  }, [isLoading]);

  return (
    <TitledContainer
      TitleComponent={<Title onBack={handleBackPress} />}
      color={colors.blue}
    >
      <RN.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID={'main.settings.index.view'}
      >
        <RN.View>
          <Message style={styles.bodyText} id="main.userreport.bodyText1" />
          <Message style={styles.bodyText} id="main.userreport.bodyText2" />
          <Message style={styles.bodyText} id="main.userreport.bodyText3" />
          <NamedInputField
            name="main.userreport.description.label"
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            onBlur={checkIsDescriptionValid}
            multiline
          />
          {isValidDescription ? null : (
            <Message
              style={styles.error}
              id="main.settings.account.email.invalid"
            />
          )}
          <NamedInputField
            name="main.userreport.contact.label"
            style={styles.contactInformationInput}
            value={''}
            onChangeText={() => {}}
          />
        </RN.View>
        <Button
          onPress={handleReport}
          messageId="main.userreport.send.button"
          disabled={description.length === 0}
        />
      </RN.ScrollView>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    ...fonts.titleLarge,
    ...textShadow,
    textAlign: 'center',
    color: colors.deepBlue,
  },
  scrollView: {
    zIndex: 1,
    marginTop: -32,
    backgroundColor: 'lightpink',
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  bodyText: {
    ...fonts.regular,
    color: colors.darkestBlue,
    marginBottom: 32,
  },
  descriptionInput: {
    backgroundColor: 'yellow',
    marginBottom: 16,
  },
  contactInformationInput: {
    backgroundColor: 'yellow',
  },
  error: {
    color: colors.red,
    fontWeight: '500',
    marginTop: -12,
    marginBottom: 16,
  },
});

export default UserReport;
