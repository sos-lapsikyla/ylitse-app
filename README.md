# Ylitse mobile application

## Development

### Node version
Use node-version specified in .nvmrc

```sh
nvm use
```

Install dependencies:

```sh
npm install
```

Create a config file by copying local config example:

```sh
cp config.template.ios.json config.json
```

You can edit the config file as suited:

| Parameter          | Description                      |
| --------------     | ---------------------------------|
| `baseUrl`          | Ylitse API base URL              |
| `loginUrl`         | Ylitse service login URL         |
| `feedBackUrl`      | Feedback form URL                |
| `termsUrl`         | Terms and conditions URL         |
| `userGuideUrl`     | User's manual URL                |
| `apuuUrl`          | Apuu-chat URL                    |
| `sekasinUrl`       | Sekasin-chat URL                 |
| `saferSpaceUrl`    | Principals of a safer space URL  |
| `messageFetchDelay`| Delay between polling            |


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


### Debugging

We are using [Flipper](https://fbflipper.com/) for debugging, so install the [Desktop application](https://fbflipper.com/docs/getting-started/) to your environment

1. Run the application
2. Open [Flipper](https://fbflipper.com/docs/getting-started/#setup-your-react-native-app)
3. Install plugin [redux-debugger](https://github.com/jk-gan/flipper-plugin-redux-debugger)
4. Now you should see all logs, networking and redux things in the Flipper tool

For troubleshooting, please refer to the [Flipper documentation](https://fbflipper.com/docs/getting-started/troubleshooting/)

#### Fixing issue when running API locally
Setup adb reverse connections:
```sh
adb reverse tcp:8081 tcp:8081; adb reverse tcp:8080 tcp:8080
```



### Running end-to-end tests

Its a good idea to clean up the project first

Android
```sh
make clean
```

iOS
```
cd ios && rm -rf Pods && pod update && pod install & cd .. 
```

Then you can proceed to build the debug-application
Refer to the detoxrc.js `configurations` for targetting correct device/emulator


```sh
npx detox build --configuration {{target}}
```


Run the steps described below in three separate terminals.

1. Go to Ylitse [API repo](https://gitlab.com/ylitse/ylitse-api) and start the backend locally (make sure `admin`
   user exists):

```sh
source env/bin/activate
SAFETY_FEATURE=true make run-standalone
```

2. Start the metro bundler 

```sh
npx react-native start
```

3. And finally run tests (make sure password and the mfa-secret matches the one configured for
   the local API, and make sure that config.json _loginUrl_ and _baseUrl_  matches the target)


```sh
YLITSE_API_USER={{userwithadminaccess}} YLITSE_API_PASS={{password}} YLITSE_API_URL="http://127.0.0.1:8080" YLITSE_MFA_SECRET={{mfa_secret}} npx detox test --configuration {{target}}
```

Replace the moustached values with your values

#### Troubleshooting

- If you get error ==ReferenceError: fetch is not defined== then you are not running the tests with npm 18, which ships with fetch. Refer to the _Node version_ section of this README

- If you get error ==ECONNREFUSED== then you are probably using localhost as a value for the ${YLITSE_API_URL} env-variable. Replace localhost with 127.0.0.1
