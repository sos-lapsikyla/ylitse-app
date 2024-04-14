module.exports = {
  testRunner: {
    $0: 'jest',
    args: {
      config: 'e2e/jest.config.js',
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'ios.simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'android.emulator',
      app: 'android.debug',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/ylitse.app',
      build:
        "xcodebuild -workspace ios/ylitse.xcworkspace -configuration Debug -scheme ylitse -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' -derivedDataPath ios/build",
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    'ios.simulator': {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' },
    },
    'android.emulator': {
      type: 'android.emulator',
      device: { avdName: 'pixel' },
    },
    'android.attached': {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
  },
};
