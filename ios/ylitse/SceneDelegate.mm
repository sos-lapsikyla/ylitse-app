#import "SceneDelegate.h"
#import "AppDelegate.h"

#import <UserNotifications/UserNotifications.h>

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  NSAssert([scene isKindOfClass:[UIWindowScene class]], @"Expected a window scene");

  AppDelegate *appDelegate = (AppDelegate *)UIApplication.sharedApplication.delegate;
  NSMutableDictionary *launchOptions = [appDelegate.launchOptions mutableCopy] ?: [NSMutableDictionary dictionary];
  if (connectionOptions.notificationResponse != nil) {
    launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey] =
        connectionOptions.notificationResponse.notification.request.content.userInfo;
  }

  self.window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
  self.window.rootViewController = [appDelegate rootViewControllerWithLaunchOptions:launchOptions];
  // React Native Firebase still looks up the root view through the app delegate.
  appDelegate.window = self.window;
  [self.window makeKeyAndVisible];
}

@end
