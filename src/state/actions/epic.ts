import { Observable } from 'rxjs';
import { AppState as State } from '../model';
import * as regular from './regular';

export type FetchCmd = {
  type: 'fetchCmd';
  f: (state: State) => Observable<regular.Action>;
};

export function cmd(f: (state: State) => Observable<regular.Action>): FetchCmd {
  return {
    type: 'fetchCmd',
    f,
  };
}
