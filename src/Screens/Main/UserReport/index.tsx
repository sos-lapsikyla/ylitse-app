import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';
import {
  coolDownDuration,
  selectUserReportStatus,
} from 'src/state/reducers/userReport';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../..';
import { ValidDescription } from 'src/lib/validators';
import { isRight } from 'fp-ts/lib/Either';

import { Title } from './Title';
import TitledContainer from 'src/Screens/components/TitledContainer';
import colors from 'src/Screens/components/colors';
import NamedInputField from 'src/Screens/components/NamedInputField';
import fonts from 'src/Screens/components/fonts';
import Message from '../../components/Message';
import { Toast } from 'src/Screens/components/Toast';
import { BottomActions } from './BottomActions';

export type UserReportRoute = {
  'Main/UserReport': { reportedId: string };
};

type Props = StackScreenProps<StackRoutes, 'Main/UserReport'>;

const UserReport = ({ navigation, route }: Props) => {
  const reportedId = route.params?.reportedId;

  const { isLoading, isSuccess, isError } = ReactRedux.useSelector(
    selectUserReportStatus,
  );
  const dispatch = ReactRedux.useDispatch();
  const [description, setDescription] = React.useState('');
  const [contact, setContact] = React.useState('');
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
        contact,
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
          <NamedInputField
            testID="main.userreport.description.input"
            name="main.userreport.description.label"
            style={styles.descriptionInput}
            labelStyle={
              isValidDescription ? styles.inputLabel : styles.errorLabel
            }
            inputStyle={
              !isValidDescription ? styles.descriptionValidationError : {}
            }
            value={description}
            onChangeText={setDescription}
            onBlur={checkIsDescriptionValid}
            multiline
          />
          {!isValidDescription && (
            <Message
              style={styles.validationMessage}
              id="main.userreport.description.validationerror"
            />
          )}
          <NamedInputField
            testID="main.userreport.contact.input"
            name="main.userreport.contact.label"
            labelStyle={styles.inputLabel}
            value={contact}
            onChangeText={setContact}
          />
        </RN.View>
        <BottomActions
          onBack={handleBackPress}
          onSend={handleReport}
          isSendDisabled={!isValidDescription || description.length === 0}
        />
      </RN.ScrollView>
      {isError && (
        <Toast
          toastType="danger"
          duration={coolDownDuration}
          messageId="main.userreport.failure.toast"
        />
      )}
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  scrollView: {
    zIndex: 1,
    marginTop: -16,
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  bodyText: {
    ...fonts.regular,
    color: colors.darkestBlue,
    marginBottom: 16,
  },
  inputLabel: {
    fontWeight: '500',
  },
  errorLabel: {
    color: colors.danger,
    fontWeight: '500',
  },
  descriptionInput: {
    marginBottom: 16,
  },
  descriptionValidationError: {
    borderColor: colors.danger,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  validationMessage: {
    ...fonts.regular,
    color: colors.danger,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 16,
  },
});

export default UserReport;
