/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { AssertionError } from 'assert';
import type { Config } from '@jest/types';
import expect = require('expect');
import type CallTracker from '../../node_modules/jest-jasmine2/build/jasmine/CallTracker';
import type Env from '../../node_modules/jest-jasmine2/build/jasmine/Env';
import type JsApiReporter from '../../node_modules/jest-jasmine2/build/jasmine/JsApiReporter';
import type ReportDispatcher from '../../node_modules/jest-jasmine2/build/jasmine/ReportDispatcher';
import type {
  default as Spec,
  SpecResult,
} from '../../node_modules/jest-jasmine2/build/jasmine/Spec';
import type SpyStrategy from '../../node_modules/jest-jasmine2/build/jasmine/SpyStrategy';
import type {
  default as Suite,
  SuiteResult,
} from '../../node_modules/jest-jasmine2/build/jasmine/Suite';
import type Timer from '../../node_modules/jest-jasmine2/build/jasmine/Timer';
import type createSpy from '../../node_modules/jest-jasmine2/build/jasmine/createSpy';
import type SpyRegistry from '../../node_modules/jest-jasmine2/build/jasmine/spyRegistry';
import Detox from '../../node_modules/detox/index.d';
export declare type SpecDefinitionsFn = () => void;
export interface AssertionErrorWithStack extends AssertionError {
  stack: string;
}
export declare type SyncExpectationResult = {
  pass: boolean;
  message: () => string;
};
export declare type AsyncExpectationResult = Promise<SyncExpectationResult>;
export declare type ExpectationResult =
  | SyncExpectationResult
  | AsyncExpectationResult;
export declare type RawMatcherFn = (
  expected: unknown,
  actual: unknown,
  options?: unknown,
) => ExpectationResult;
export declare type RunDetails = {
  totalSpecsDefined?: number;
  failedExpectations?: SuiteResult['failedExpectations'];
};
export declare type Reporter = {
  jasmineDone: (runDetails: RunDetails) => void;
  jasmineStarted: (runDetails: RunDetails) => void;
  specDone: (result: SpecResult) => void;
  specStarted: (spec: SpecResult) => void;
  suiteDone: (result: SuiteResult) => void;
  suiteStarted: (result: SuiteResult) => void;
};
export interface Spy extends Record<string, any> {
  (this: Record<string, unknown>, ...args: Array<any>): unknown;
  and: SpyStrategy;
  calls: CallTracker;
  restoreObjectToOriginalState?: () => void;
}
declare type JasmineMatcher = {
  (matchersUtil: unknown, context: unknown): JasmineMatcher;
  compare: () => RawMatcherFn;
  negativeCompare: () => RawMatcherFn;
};
export declare type JasmineMatchersObject = {
  [id: string]: JasmineMatcher;
};
export declare type Jasmine = {
  _DEFAULT_TIMEOUT_INTERVAL: number;
  DEFAULT_TIMEOUT_INTERVAL: number;
  currentEnv_: ReturnType<typeof Env>['prototype'];
  getEnv: (
    options?: Record<string, unknown>,
  ) => ReturnType<typeof Env>['prototype'];
  createSpy: typeof createSpy;
  Env: ReturnType<typeof Env>;
  JsApiReporter: typeof JsApiReporter;
  ReportDispatcher: typeof ReportDispatcher;
  Spec: typeof Spec;
  SpyRegistry: typeof SpyRegistry;
  Suite: typeof Suite;
  Timer: typeof Timer;
  version: string;
  testPath: Config.Path;
  addMatchers: (matchers: JasmineMatchersObject) => void;
} & typeof expect &
  NodeJS.Global;
declare global {
  module NodeJS {
    interface Global {
      expect: typeof Detox.expect;
    }
  }
}
export {};
