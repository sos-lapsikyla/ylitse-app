import { ChatStatus } from 'src/api/buddies';
import { DropDownItem } from 'src/Screens/components/DropDownMenu';

export const dialogProperties = {
  deleted: {
    messageId: 'main.chat.delete.confirmation',
    modalType: 'danger',
  },
  ok: {
    messageId: 'main.chat.unban.confirmation',
    modalType: 'info',
  },
  banned: {
    messageId: 'main.chat.ban.confirmation',
    modalType: 'warning',
  },
  archived: {
    messageId: 'main.chat.archive.confirmation',
    modalType: 'info',
  },
} as const;

type Item = Omit<DropDownItem, 'onPress'> & {
  nextStatus: ChatStatus;
};

export const changeChatStatusOptions: Record<ChatStatus, Item[]> = {
  banned: [
    { textId: 'main.chat.unban', nextStatus: 'ok' },
    { textId: 'main.chat.delete', nextStatus: 'deleted' },
  ],
  ok: [
    {
      textId: 'main.chat.ban',
      nextStatus: 'banned',
    },
    {
      textId: 'main.chat.archive',
      nextStatus: 'archived',
    },
  ],
  archived: [
    { textId: 'main.chat.unban', nextStatus: 'ok' },
    { textId: 'main.chat.delete', nextStatus: 'deleted' },
  ],
  deleted: [],
};
