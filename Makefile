PATH:=${PATH}:node_modules/.bin
YLITSE_DEVICE?=pixel
YLITSE_API_USER:=${YLITSE_API_USER}
YLITSE_API_PASS:=${YLITSE_API_PASS}

install:
	npm install

reinstall: reset install

bundler:
	react-native start

android:
	react-native run-android

build-apk:
	cd android && ./gradlew assembleRelease
	@echo "adb install ./android/app/build/outputs/apk/release/app-release.apk"

e2e:
	detox build --configuration android.emu.debug
	detox test --device-name ${YLITSE_DEVICE} --configuration android.emu.debug

clean:
	find . -type f -name '*~' -exec rm -f {} \;
	cd android && ./gradlew clean
	rm -rf android/build android/.gradle
	rm -rf $${TMPDIR:-/tmp}/metro-bundler-cache-*
	rm -rf $${TMPDIR:-/tmp}/react-native-packager-cache-*
	rm -rf coverage
	rm -rf dist
	jest --clearCache

reset: clean
	rm -rf node_modules

.EXPORT_ALL_VARIABLES:

.PHONY: install bundler android build-apk e2e clean
