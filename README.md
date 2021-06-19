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

| Parameter      | Description              |
| -------------- | ------------------------ |
| `baseUrl`      | Ylitse API base URL      |
| `loginUrl`     | Ylitse service login URL |
| `feedBackUrl`  | Feedback form URL        |
| `termsUrl`     | Terms and conditions URL |
| `userGuideUrl` | User's manual URL        |

After installation run metro package bundler:

```sh
npm start
```

To deploy the app on an android device run:

```sh
npm run android
```

Or on an iOS device (you have to use a MacBook for this):

```sh
npm run ios
```

### Genymotion

First start up one of your devices from Genymotion.
Then make sure config.json connects to localhost.

```js
 "baseUrl": "http://localhost:8080",
 "loginUrl": "http://localhost:3000/login",
```


Setup adb reverse connections:
```sh
adb reverse tcp:8081 tcp:8081; adb reverse tcp:8080 tcp:8080
```

Start the app
```sh
npm run android
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
