#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate

@property (nonatomic, copy) NSDictionary *launchOptions;

- (UIViewController *)rootViewControllerWithLaunchOptions:(NSDictionary *)launchOptions;

@end
