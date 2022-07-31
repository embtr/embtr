import { isBrowser, isMobile } from 'react-device-detect';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
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
}

export const isMobileBrowser = (): boolean => {
    return isMobile === true;
}

export const isIosApp = () : boolean => {
    return Platform.OS === "ios"
}

export const isPhysicalDevice = () : boolean => {
    return Device.isDevice;
}

export const isAndroidDevice = () : boolean => {
    return Platform.OS === 'android';
}