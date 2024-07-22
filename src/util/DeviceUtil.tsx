import { isBrowser, isMobile } from 'react-device-detect';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { getWindowHeight, getWindowWidth } from 'src/util/GeneralUtility';
import Constants from 'expo-constants';
//import { Platform } from 'react-native';

/*
desktop browser web
    Platform.OS: web
    Device.osName: Mac OS
    isMobile: false
    isBrowser: true
    useEffectPlatformOs: web

android mobile web
    Platform.OS: web
    Device.osName: Android
    isMobile: true
    isBrowser: false
    useEffectPlatformOs: web

ios mobile web
    Platform.OS: web
    Device.osName: iOS
    isMobile: true
    isBrowser: false
    useEffectPlatformOs: web

android app
    Platform.OS: N/A
    Device.osName: garbage
    isMobile: undefined
    isBrowser: true
    useEffectPlatformOs: android

ios app
    Platform.OS: ios
    Device.osName: iOS
    isMobile: undefined
    isBrowser: true
    useEffectPlatformOs: ios
*/

export const isDesktopBrowser = (): boolean => {
    return isMobile === false && isBrowser === true;
};

export const isMobileBrowser = (): boolean => {
    return isMobile === true;
};

export const isIosApp = (): boolean => {
    return Platform.OS === 'ios';
};

export const isPhysicalDevice = (): boolean => {
    return Device.isDevice;
};

export const isAndroidDevice = (): boolean => {
    return Platform.OS === 'android';
};

export const hasIosBottomBar = (): boolean => {
    try {
        const modelId = Device.modelId;
        if (!modelId.includes('iPhone')) {
            return false;
        }

        const fullModelNumber = modelId.replace('iPhone', '');
        const majorModelNumber = parseInt(fullModelNumber.split(',')[0]);

        return majorModelNumber >= 10 && majorModelNumber != 12;
    } catch (e) {
        return false;
    }
};

export const isExpoGo = (): boolean => {
    return Constants.appOwnership === 'expo';
};

export const isShortDevice = (): boolean => {
    return getWindowHeight() < 700;
};

export const isNarrowDevice = (): boolean => {
    return getWindowWidth() < 370;
};

export const isExtraWideDevice = (): boolean => {
    return getWindowWidth() > 800;
};
