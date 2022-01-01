import { isBrowser, isMobile } from 'react-device-detect';
//import * as Device from 'expo-device';
//import { Platform } from 'react-native';

/*
desktop browser web
    Platform.OS: web
    Device.osName: Mac OS
    isMobile: false
    isBrowser: true
    useEffectPlatformOs: web


if (isMobile === false && isBrowser === true)


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