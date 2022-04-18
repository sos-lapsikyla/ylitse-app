import { BanAction, BanStatus } from 'src/api/buddies';
import { DropDownItem } from 'src/Screens/components/DropDownMenu';

export const dialogProperties = {
  Delete: {
    textId: 'main.chat.delete.confirmation',
    type: 'danger',
  },
  Unban: {
    textId: 'main.chat.unban.confirmation',
    type: 'restore',
  },
  Ban: {
    textId: 'main.chat.ban.confirmation',
    type: 'warning',
  },
  Archive: {
    textId: 'main.chat.archive.confirmation',
    type: 'restore',
  },
} as const;

type BanItem = Omit<DropDownItem, 'onPress'> & { action: BanAction };
export const dropdownItems: Record<BanStatus, BanItem[]> = {
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
