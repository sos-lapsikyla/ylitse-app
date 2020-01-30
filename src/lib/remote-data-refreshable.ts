import * as remoteData from './remote-data';
import assertNever from './assert-never';

export type Refreshing<A> = {
  type: 'Refreshing';
  value: A;
};

export type RefreshingFailure<A, E> = {
  type: 'RefreshingFailure';
  value: A;
  error: E;
};

export type Refreshable<A, E = Error> =
  | remoteData.RemoteData<A, E>
  | Refreshing<A>
  | RefreshingFailure<A, E>;

export function toRemoteData<A, E>(
  refreshable: Refreshable<A, E>,
): remoteData.RemoteData<A, E> {
  switch (refreshable.type) {
    case 'NotAsked':
    case 'Err':
    case 'Loading':
    case 'Ok':
      return refreshable;
    case 'Refreshing':
    case 'RefreshingFailure':
      return remoteData.ok(refreshable.value);
    default:
      assertNever(refreshable);
  }
}
