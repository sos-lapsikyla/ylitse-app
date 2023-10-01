import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { tuple } from 'fp-ts/lib/function';

import * as userAccountState from '../../../../state/reducers/userAccount';
import * as actions from '../../../../state/actions';

import RemoteData from '../../../components/RemoteData';
import Message from '../../../components/Message';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import MentorForm from './MentorForm';
import IconButton from 'src/Screens/components/IconButton';

type Props = {
  openPasswordForm: () => void;
  openEmailForm: () => void;
};

export default ({ openPasswordForm, openEmailForm }: Props) => {
  const userAccount = useSelector(userAccountState.getAccount);
  const dispatch = useDispatch<redux.Dispatch<actions.Action>>();

  const fetchUserAccount = () => {
    dispatch({ type: 'userAccount/get/start', payload: undefined });
  };

  const data = RD.remoteData.map(userAccount, account =>
    tuple(account, account.userName !== account.displayName),
  );

  return (
    <>
      <Message style={styles.accountSettingsText} id="main.settings.title" />
      <RemoteData
        data={data}
        fetchData={fetchUserAccount}
        errorStyle={styles.errorStyle}
      >
        {([{ userId, userName, displayName, email, role }, hasBoth]) => (
          <>
            <RN.View style={styles.dataContainer}>
              <Message
                style={styles.fieldName}
                id="main.settings.account.userName"
              />
              <RN.Text
                style={styles.fieldValueText}
                testID="main.settings.account.userName"
              >
                {userName}
              </RN.Text>
            </RN.View>
            {hasBoth ? (
              <RN.View style={styles.dataContainer}>
                <Message
                  style={styles.fieldName}
                  id="main.settings.account.displayName"
                />
                <RN.Text
                  style={styles.fieldValueText}
                  testID="main.settings.account.displayName"
                >
                  {displayName}
                </RN.Text>
              </RN.View>
            ) : null}
            <RN.View style={styles.dataContainer}>
              <RN.View style={styles.headerContainer}>
                <Message
                  style={styles.fieldName}
                  id="main.settings.account.email.title"
                />
                <IconButton
                  badge={require('../../../images/pen.svg')}
                  onPress={openEmailForm}
                  testID="main.settings.account.email.change"
                  noShadow
                />
              </RN.View>
              {email ? (
                <RN.Text
                  style={styles.fieldValueText}
                  testID="main.settings.account.email"
                >
                  {email}
                </RN.Text>
              ) : (
                <Message
                  style={styles.fieldValueText}
                  id="main.settings.account.email.missing"
                />
              )}
            </RN.View>
            <RN.View style={styles.dataContainerLast}>
              <RN.View style={styles.headerContainer}>
                <Message
                  style={styles.fieldName}
                  id="main.settings.account.password.title"
                />
                <IconButton
                  badge={require('../../../images/pen.svg')}
                  onPress={openPasswordForm}
                  testID="main.settings.account.password.change"
                  noShadow
                />
              </RN.View>
              <RN.Text style={styles.fieldValueText}>{'********'}</RN.Text>
            </RN.View>
            {role === 'mentor' ? <MentorForm userId={userId} /> : null}
          </>
        )}
      </RemoteData>
    </>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 24,
    paddingBottom: 32,
    marginBottom: 32,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  dataContainer: {
    paddingVertical: 16,
    borderBottomColor: colors.formBorderGray,
    borderBottomWidth: 1,
  },
  dataContainerLast: {
    paddingVertical: 16,
  },
  accountSettingsText: {
    ...fonts.titleBold,
    color: colors.darkestBlue,
    marginBottom: 24,
  },
  fieldName: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
  },
  fieldValueText: {
    color: colors.darkestBlue,
  },
  link: {
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    ...fonts.regularBold,
    // ...textShadow,
    color: colors.deepBlue,
  },
  errorStyle: { margin: 0 },
});
