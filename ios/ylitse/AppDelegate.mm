#import "AppDelegate.h"
#import <Firebase.h> // firebase/messaging

#import <React/RCTBundleURLProvider.h>

@interface AppDelegate ()

@property (nonatomic, strong) UIViewController *reactRootViewController;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ylitse";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.launchOptions = launchOptions;
  self.automaticallyLoadReactNativeWindow = NO;

  [FIRApp configure]; // firebase/messaging

  BOOL didFinishLaunching = [super application:application didFinishLaunchingWithOptions:launchOptions];

  // Silent pushes can launch the app without connecting a foreground scene.
  if (application.applicationState == UIApplicationStateBackground) {
    [self rootViewControllerWithLaunchOptions:launchOptions];
  }

  return didFinishLaunching;
}

- (UIViewController *)rootViewControllerWithLaunchOptions:(NSDictionary *)launchOptions
{
  if (self.reactRootViewController == nil) {
    UIView *rootView = [self.rootViewFactory viewWithModuleName:self.moduleName
                                            initialProperties:self.initialProps
                                                launchOptions:launchOptions];
    self.reactRootViewController = [self createRootViewController];
    [self setRootView:rootView toRootViewController:self.reactRootViewController];
  }

  return self.reactRootViewController;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
