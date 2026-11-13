#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <React/RCTLog.h>
#import <React/RCTRootView.h>

#import "../ylitse/AppDelegate.h"

#define TIMEOUT_SECONDS 600
#define TEXT_TO_LOOK_FOR @"Welcome to React"

@interface ylitseTests : XCTestCase

@end

@implementation ylitseTests

- (void)testSceneManifest
{
  NSDictionary *manifest = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIApplicationSceneManifest"];
  NSArray *configurations = manifest[@"UISceneConfigurations"][@"UIWindowSceneSessionRoleApplication"];

  XCTAssertEqualObjects(manifest[@"UIApplicationSupportsMultipleScenes"], @NO);
  XCTAssertEqual(configurations.count, 1);
  XCTAssertEqualObjects(configurations.firstObject[@"UISceneDelegateClassName"], @"SceneDelegate");
  XCTAssertNotNil(NSClassFromString(@"SceneDelegate"));
}

- (void)testSceneOwnsReactNativeWindow
{
  id<UIApplicationDelegate> appDelegate = RCTSharedApplication().delegate;
  NSPredicate *hasSceneWindow = [NSPredicate predicateWithBlock:^BOOL(id object, NSDictionary *bindings) {
    return appDelegate.window.windowScene != nil && appDelegate.window.rootViewController != nil;
  }];
  [self expectationForPredicate:hasSceneWindow evaluatedWithObject:appDelegate handler:nil];
  [self waitForExpectationsWithTimeout:10 handler:nil];

  UIWindow *window = appDelegate.window;
  id<UIWindowSceneDelegate> sceneDelegate = (id<UIWindowSceneDelegate>)window.windowScene.delegate;
  XCTAssertTrue(window.isKeyWindow);
  XCTAssertEqualObjects(NSStringFromClass([sceneDelegate class]), @"SceneDelegate");
  XCTAssertEqual(sceneDelegate.window, window);
  XCTAssertEqualObjects(NSStringFromClass([window.rootViewController.view class]), @"RCTRootView");
}

- (void)testReactNativeRootViewControllerIsReused
{
  AppDelegate *appDelegate = (AppDelegate *)RCTSharedApplication().delegate;
  UIViewController *rootViewController = appDelegate.window.rootViewController;

  XCTAssertNotNil(rootViewController);
  XCTAssertEqual([appDelegate rootViewControllerWithLaunchOptions:nil], rootViewController);
  XCTAssertEqual([appDelegate rootViewControllerWithLaunchOptions:@{}], rootViewController);
}

- (BOOL)findSubviewInView:(UIView *)view matching:(BOOL (^)(UIView *view))test
{
  if (test(view)) {
    return YES;
  }
  for (UIView *subview in [view subviews]) {
    if ([self findSubviewInView:subview matching:test]) {
      return YES;
    }
  }
  return NO;
}

- (void)testRendersWelcomeScreen
{
  UIViewController *vc = [[[RCTSharedApplication() delegate] window] rootViewController];
  NSDate *date = [NSDate dateWithTimeIntervalSinceNow:TIMEOUT_SECONDS];
  BOOL foundElement = NO;

  __block NSString *redboxError = nil;
#ifdef DEBUG
   RCTSetLogFunction(
      ^(RCTLogLevel level, RCTLogSource source, NSString *fileName, NSNumber *lineNumber, NSString *message) {
        if (level >= RCTLogLevelError) {
          redboxError = message;
        }
      });
#endif

  while ([date timeIntervalSinceNow] > 0 && !foundElement && !redboxError) {
    [[NSRunLoop mainRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];
    [[NSRunLoop mainRunLoop] runMode:NSRunLoopCommonModes beforeDate:[NSDate dateWithTimeIntervalSinceNow:0.1]];

    foundElement = [self findSubviewInView:vc.view
                                  matching:^BOOL(UIView *view) {
                                    if ([view.accessibilityLabel isEqualToString:TEXT_TO_LOOK_FOR]) {
                                      return YES;
                                    }
                                    return NO;
                                  }];
  }

#ifdef DEBUG
  RCTSetLogFunction(RCTDefaultLogFunction);
#endif

  XCTAssertNil(redboxError, @"RedBox error: %@", redboxError);
  XCTAssertTrue(foundElement, @"Couldn't find element with text '%@' in %d seconds", TEXT_TO_LOOK_FOR, TIMEOUT_SECONDS);
}

@end
