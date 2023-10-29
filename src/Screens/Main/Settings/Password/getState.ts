import { MessageId } from '../../../../localization';

export type PasswordState = { isOkay: boolean; messageId?: MessageId };

export const getPasswordState = (
  currentPassword: string,
  newPassword: string,
  repeatedNewPassword: string,
): PasswordState => {
  if (
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === repeatedNewPassword
  )
    return { isOkay: true };

  if (newPassword !== repeatedNewPassword) {
    return {
      isOkay: false,
      messageId: 'main.settings.account.password.invalid.same',
    };
  }

  return {
    isOkay: false,
    messageId: 'main.settings.account.password.invalid.length',
  };
};
