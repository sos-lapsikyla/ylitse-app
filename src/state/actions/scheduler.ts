import * as actionType from '../../lib/action-type';
import * as regular from './regular';

export type Action = actionType.ActionsUnion<
  keyof typeof creators,
  typeof creators
>;
export const creators = {
  ...actionType.make('startPolling', (action: regular.Action, delay) => ({
    action,
    delay,
  })),
  ...actionType.make(
    'poll',
    (actionName: regular.Action['type']) => actionName,
  ),
  ...actionType.make(
    'pollComplete',
    (actionName: regular.Action['type']) => actionName,
  ),
};

