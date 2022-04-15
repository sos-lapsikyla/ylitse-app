# Ylitse mobile application

## Development

Install dependencies:

```sh
npm install
```

Create a config file by copying local config example:

```sh
cp config.template.ios.json config.json
```

You can edit the config file as suited:

| Parameter          | Description              |
| --------------     | ------------------------ |
| `baseUrl`          | Ylitse API base URL      |
| `loginUrl`         | Ylitse service login URL |
| `feedBackUrl`      | Feedback form URL        |
| `termsUrl`         | Terms and conditions URL |
| `userGuideUrl`     | User's manual URL        |
| `apuuUrl`          | Apuu-chat URL            |
| `messageFetchDelay`| Delay between polling    |


### Running on iOS

#### Install pods
On m1 mac pods must be installed via brew, not gem
[some GH issue that explains](https://github.com/CocoaPods/CocoaPods/issues/9907)

#### Install pods via brew
```
sudo gem uninstall cocoapods
brew install cocoapods
```

If running on m1 mac and using pods installed via gem thet seem to install successfully if these commands are applied before running "pod install"

[random issues says](
https://github.com/CocoaPods/CocoaPods/issues/10518#issuecomment-798912624)
```
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

```
cd ios
pod install
```

Start metro bundler
```
npx react-native start
```

Start the app on a simulator
```
npx react-native run-ios
```

### Running on Android

```js
 "baseUrl": "http://localhost:8080",
 "loginUrl": "http://localhost:3000/login",
```

Start metro bundler
```
npx react-native start
```

Start the app on a emulator
```
npx react-native run-android
```

#### Fixing issue when running API locally
Setup adb reverse connections:
```sh
adb reverse tcp:8081 tcp:8081; adb reverse tcp:8080 tcp:8080
```



### Running end-to-end tests

Run the steps described below in separate terminals.

1. Go to Ylitse API repo and start the backend locally (make sure `admin`
   user exists):

```sh
source env/bin/activate
make run-gunicorn
```

2. Start bundler:

```sh
make bundler
```

3. And finally run tests (make sure password matches the one configured for
   the local API):

```sh
YLITSE_API_PASS=random make e2e
```

By default emulator device name is `pixel`, but you can overwrite it like so:

```sh
YLITSE_DEVICE=pixel_xl YLITSE_API_PASS=random make e2e
```

#### E2E tests with Genymotion

Running e2e tests with Genymotion is almost the same as with Android emulator or physical device.

First make sure you are able to run the app with `npm run android`

Then make sure .detoxrc.json has the correct IP address for your Genymotion device.

```js
"android.genymotion.debug": {
...
   "device": {
      "adbName": "192.168.56.101:5555"
   }
```

Then build
```sh
detox build --configuration android.genymotion.debug
```

And run tests
```sh
YLITSE_API_PASS=random detox test --configuration android.genymotion.debug
```
