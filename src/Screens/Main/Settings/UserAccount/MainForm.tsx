import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { tuple } from 'fp-ts/lib/function';

import * as userAccountState from '../../../../state/reducers/userAccount';
import * as actions from '../../../../state/actions';

import RemoteData from '../../../components/RemoteData';
import Button from '../../../components/Button';
import Message from '../../../components/Message';
import colors from '../../../components/colors';
import fonts from '../../../components/fonts';
import MentorForm from './MentorForm';

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
      <RemoteData data={data} fetchData={fetchUserAccount}>
        {([{ userId, userName, displayName, email, role }, hasBoth]) => (
          <>
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
            {hasBoth ? (
              <>
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
              </>
            ) : null}
            <Message
              style={styles.fieldName}
              id="main.settings.account.email.title"
            />
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
            <Button
              style={styles.changePasswordButton}
              messageStyle={styles.buttonText}
              onPress={openEmailForm}
              messageId="main.settings.account.email.change"
              testID="main.settings.account.email.change"
            />
            <Message
              style={styles.fieldName}
              id="main.settings.account.password.title"
            />
            <RN.Text style={styles.fieldValueText}>{'********'}</RN.Text>
            <Button
              style={styles.changePasswordButton}
              messageStyle={styles.buttonText}
              onPress={openPasswordForm}
              messageId="main.settings.account.password.button"
              testID="main.settings.account.password.button"
            />
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
  accountSettingsText: {
    ...fonts.titleBold,
    color: colors.darkestBlue,
    marginBottom: 24,
  },
  fieldName: {
    ...fonts.regular,
    color: colors.blueGray,
    marginTop: 16,
  },
  fieldValueText: {
    ...fonts.largeBold,
    color: colors.darkestBlue,
  },
  link: {
    marginTop: 8,
    marginBottom: 24,
  },
  changePasswordButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.blue,
  },
  buttonText: {
    ...fonts.regularBold,
    // ...textShadow,
    color: colors.white,
  },
});
