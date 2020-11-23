# Ylitse mobile application

## Development

Install dependencies:

```sh
npm install
```

Create a config file by copying local config example:

```sh
cp config.local.json config.json
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
