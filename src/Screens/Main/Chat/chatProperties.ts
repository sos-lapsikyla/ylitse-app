import { ChatStatus } from 'src/api/buddies';
import { DropDownItem } from 'src/Screens/components/DropDownMenu';

export const dialogProperties = {
  deleted: {
    title: 'main.chat.delete',
    messageId: 'main.chat.delete.confirmation',
    primaryButtonMessage: 'main.chat.delete.confirmation.button',
    modalType: 'danger',
  },
  ok: {
    title: 'main.chat.unban',
    messageId: 'main.chat.unban.confirmation',
    primaryButtonMessage: 'main.chat.unban.confirmation.button',
    modalType: 'info',
  },
  banned: {
    title: 'main.chat.ban',
    messageId: 'main.chat.ban.confirmation',
    primaryButtonMessage: 'main.chat.ban.confirmation.button',
    modalType: 'warning',
  },
  archived: {
    title: 'main.chat.archive',
    messageId: 'main.chat.archive.confirmation',
    primaryButtonMessage: 'main.chat.archive.confirmation.button',
    modalType: 'info',
  },
} as const;

type Item = Omit<DropDownItem, 'onPress'> & {
  nextStatus: ChatStatus;
};

export const changeChatStatusOptions: Record<ChatStatus, Item[]> = {
  banned: [
    {
      textId: 'main.chat.unban',
      nextStatus: 'ok',
    },
    {
      textId: 'main.chat.delete',
      nextStatus: 'deleted',
    },
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
    {
      textId: 'main.chat.unban',
      nextStatus: 'ok',
    },
    {
      textId: 'main.chat.delete',
      nextStatus: 'deleted',
    },
  ],
  deleted: [],
};
