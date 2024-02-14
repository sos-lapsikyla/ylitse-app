import { MessageId } from '../../../../localization';
import { ValidPassword } from '../../../../lib/validators';
import { isRight } from 'fp-ts/lib/Either';

export type PasswordState = {
  isOkay: boolean;
  messageId: MessageId;
  first?: boolean;
  second?: boolean;
};

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
      first: false,
      second: false,
      ...passwordRequirementsMessage,
    };

  if (!isValidPassword) {
    return {
      isOkay: false,
      first: true,
      ...passwordRequirementsMessage,
    };
  }

  return {
    isOkay: false,
    second: true,
    messageId: 'main.settings.account.password.invalid.same',
  };
};
