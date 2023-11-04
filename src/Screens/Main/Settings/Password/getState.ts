import { MessageId } from '../../../../localization';
import { ValidPassword } from '../../../../lib/validators';
import { isRight } from 'fp-ts/lib/Either';

export type PasswordState = { isOkay: boolean; messageId: MessageId };

export const passwordRequirementsMessage = {
  messageId: 'main.settings.account.password.requirements',
} as const;

export const getPasswordState = (
  currentPassword: string,
  newPassword: string,
  repeatedNewPassword: string,
): PasswordState => {
  const passwordParsingResult = ValidPassword.decode(newPassword);
  const isValidPassword = isRight(passwordParsingResult);

  if (
    currentPassword.length > 0 &&
    isValidPassword &&
    newPassword === repeatedNewPassword
  )
    return {
      isOkay: true,
      ...passwordRequirementsMessage,
    };

  if (newPassword !== repeatedNewPassword) {
    return {
      isOkay: false,
      messageId: 'main.settings.account.password.invalid.same',
    };
  }

  return {
    isOkay: false,
    ...passwordRequirementsMessage,
  };
};
