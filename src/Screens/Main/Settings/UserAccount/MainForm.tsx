import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { tuple } from 'fp-ts/lib/function';

import * as config from '../../../../api/config';
import * as userAccountState from '../../../../state/reducers/userAccount';
import * as actions from '../../../../state/actions';

import colors from '../../../components/colors';
import fonts from '../../../components/fonts';

import RemoteData from '../../../components/RemoteData';
import Message from '../../../components/Message';
import Button from '../../../components/Button';
import MentorForm from './MentorForm';
import { FormItem } from './FormItem';

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

  const openProfile = () => {
    RN.Linking.openURL(config.loginUrl);
  };

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
            <FormItem labelMessageId="main.settings.account.userName">
              <RN.Text
                style={styles.fieldValueText}
                testID="main.settings.account.userName"
              >
                {userName}
              </RN.Text>
            </FormItem>

            {hasBoth && (
              <FormItem labelMessageId="main.settings.account.displayName">
                <RN.Text
                  style={styles.fieldValueText}
                  testID="main.settings.account.displayName"
                >
                  {displayName}
                </RN.Text>
              </FormItem>
            )}
            <FormItem
              labelMessageId="main.settings.account.email.title"
              button={{
                testID: 'main.settings.account.email.change',
                onClick: openEmailForm,
              }}
            >
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
            </FormItem>
            <FormItem
              labelMessageId="main.settings.account.password.title"
              button={{
                testID: 'main.settings.account.password.change',
                onClick: openPasswordForm,
              }}
              style={styles.dataContainerLast}
            >
              <RN.Text style={styles.fieldValueText}>{'********'}</RN.Text>
            </FormItem>
            <RN.View style={styles.dataContainer}>
              <Message
                style={styles.fieldName}
                id="main.settings.account.profile.title"
              />
              <Button
                style={styles.button}
                onPress={openProfile}
                messageId="main.settings.account.profile.button"
              />
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
  dataContainer: {
    paddingVertical: 16,
    borderTopColor: colors.formBorderGray,
    borderTopWidth: 1,
  },
  fieldName: {
    ...fonts.regularBold,
    color: colors.darkestBlue,
    marginTop: 16,
  },
  dataContainerLast: {
    paddingVertical: 16,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  accountSettingsText: {
    ...fonts.titleBold,
    color: colors.darkestBlue,
    marginBottom: 24,
  },
  fieldValueText: {
    color: colors.darkestBlue,
  },
  errorStyle: { margin: 0 },
});
