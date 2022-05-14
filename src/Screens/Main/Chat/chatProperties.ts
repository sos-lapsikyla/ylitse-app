import { ChangeChatStatusAction, ChatStatus } from 'src/api/buddies';
import { DropDownItem } from 'src/Screens/components/DropDownMenu';

export const dialogProperties = {
  Delete: {
    messageId: 'main.chat.delete.confirmation',
    modalType: 'danger',
  },
  Unban: {
    messageId: 'main.chat.unban.confirmation',
    modalType: 'info',
  },
  Ban: {
    messageId: 'main.chat.ban.confirmation',
    modalType: 'warning',
  },
  Archive: {
    messageId: 'main.chat.archive.confirmation',
    modalType: 'info',
  },
} as const;

type BanItem = Omit<DropDownItem, 'onPress'> & {
  action: ChangeChatStatusAction;
};
export const dropdownItems: Record<ChatStatus, BanItem[]> = {
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
  Deleted: [],
  Archived: [
    { textId: 'main.chat.unban', action: 'Unban' },
    { textId: 'main.chat.delete', action: 'Delete' },
  ],
};
