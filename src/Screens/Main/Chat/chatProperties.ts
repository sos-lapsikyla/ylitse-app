import { ChangeChatStatusAction, ChatStatus } from 'src/api/buddies';
import { DropDownItem } from 'src/Screens/components/DropDownMenu';

export const dialogProperties = {
  Delete: {
    messageId: 'main.chat.delete.confirmation',
    primaryButtonMessage: 'main.chat.delete',
    secondaryButtonMessage: 'meta.back',
    modalType: 'danger',
  },
  Unban: {
    messageId: 'main.chat.unban.confirmation',
    modalType: 'info',
    primaryButtonMessage: 'main.chat.unban',
    secondaryButtonMessage: 'meta.back',
  },
  Ban: {
    messageId: 'main.chat.ban.confirmation',
    modalType: 'warning',
    primaryButtonMessage: 'main.chat.ban',
    secondaryButtonMessage: 'meta.back',
  },
  Archive: {
    messageId: 'main.chat.archive.confirmation',
    modalType: 'info',
    primaryButtonMessage: 'main.chat.archive',
    secondaryButtonMessage: 'meta.back',
  },
} as const;

type BanItem = Omit<DropDownItem, 'onPress'> & {
  action: ChangeChatStatusAction;
};

export const changeChatStatusOptions: Record<ChatStatus, BanItem[]> = {
  Banned: [
    { textId: 'main.chat.unban', action: 'Unban' },
    { textId: 'main.chat.delete', action: 'Delete' },
  ],
  NotBanned: [
    {
      textId: 'main.chat.ban',
      action: 'Ban',
    },
    {
      textId: 'main.chat.archive',
      action: 'Archive',
    },
  ],
  Archived: [
    { textId: 'main.chat.unban', action: 'Unban' },
    { textId: 'main.chat.delete', action: 'Delete' },
  ],
  Deleted: [],
};
