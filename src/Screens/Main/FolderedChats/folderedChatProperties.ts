import * as buddyState from '../../../state/reducers/buddies';
import * as RD from '@devexperts/remote-data-ts';

import { ChatStatus, Buddy } from '../../../api/buddies';
import { MessageId } from '../../../localization/fi';
import { AppState } from '../../../state/types';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from 'src/Screens';

export type FolderedChatsRoute = {
  'Main/FolderedChats': {
    folderType: FolderType;
  };
};

export type Props = StackScreenProps<StackRoutes, 'Main/FolderedChats'>;

export type FolderType = Extract<ChatStatus, 'archived' | 'banned'>;

export type ListData = {
  titleId: MessageId;
  buddySelector: (appState: AppState) => RD.RemoteData<string, Buddy[]>;
};

export const listData: Record<FolderType, ListData> = {
  archived: {
    titleId: 'main.chat.navigation.archived',
    buddySelector: buddyState.getArchivedBuddies,
  },
  banned: {
    titleId: 'main.chat.navigation.banned',
    buddySelector: buddyState.getBannedBuddies,
  },
};
