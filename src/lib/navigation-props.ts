import ReactNavigation from 'react-navigation';

type Params<K extends string, V> = {
  [k in K]: V;
};

export type RouteDeclaration<Names extends string, K extends string, V> = {
  [N in Names]: Params<K, V>;
};

interface NavigationScreenProp<
  MyRoute extends RouteDeclaration<string, string, unknown>,
  NextRoute extends RouteDeclaration<string, string, unknown>
> extends ReactNavigation.NavigationScreenProp<unknown> {
  navigate<N extends keyof NextRoute>(options: {
    routeName: N;
    params: NextRoute[N];
  }): boolean;
  navigate<N extends keyof NextRoute>(
    routeName: N,
    params: NextRoute[N],
  ): boolean;
  replace<N extends keyof NextRoute>(options: {
    routeName: N;
    params: NextRoute[N];
  }): boolean;
  replace<N extends keyof NextRoute>(
    routeName: N,
    params: NextRoute[N],
  ): boolean;
  getParam<N extends keyof MyRoute, K extends keyof MyRoute[N]>(
    k: K,
  ): MyRoute[N][K];
}

export interface NavigationProps<
  MyRoute extends RouteDeclaration<string, string, unknown>,
  NextRoute extends RouteDeclaration<string, string, unknown>
> {
  navigation: NavigationScreenProp<MyRoute, NextRoute>;
}
