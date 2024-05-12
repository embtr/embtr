import * as Notifications from 'expo-notifications';
import UserController from 'src/controller/user/UserController';
import { AppState, Linking } from 'react-native';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { darkColors } from 'src/theme/ColorThemes';
import { User } from 'resources/schema';
import Constants from 'expo-constants';
import { CreatePushNotificationTokenRequest } from 'resources/types/requests/NotificationTypes';
import axiosInstance from 'src/axios/axios';
import React from 'react';

class PushNotificationController {
    public static registerPushNotificationToken = async () => {
        const isAllowedToRequestNotificationToken =
            await PushNotificationController.isAllowedToRequestNotificationToken();
        if (!isAllowedToRequestNotificationToken) {
            return;
        }

        await PushNotificationController.setAndroidNotificationChannel();
        const token = await PushNotificationController.getPushNotificationToken();
        if (!token) {
            return;
        }

        await PushNotificationController.createPushNotificationToken(token);
    };

    private static async isAllowedToRequestNotificationToken() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    }

    private static async getPushNotificationToken() {
        const projectId =
            Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas.projectId;

        let token: string | undefined = undefined;
        try {
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
        } catch (error) {
            // 2024-01-21 - detecting missing projectId
        }

        return token;
    }

    private static async createPushNotificationToken(token: string) {
        const user: User | undefined = await UserController.getCurrentUser();
        if (!user) {
            return;
        }

        const request: CreatePushNotificationTokenRequest = {
            token: token,
        };

        return await axiosInstance
            .post(`/user/createPushNotificationToken/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async setAndroidNotificationChannel() {
        if (!isAndroidDevice()) {
            return;
        }

        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: darkColors.primary_border,
        });
    }

    public static async openNotificationsSettings() {
        await Linking.openSettings();
    }

    public static async canRequestPushNotifications() {
        const requestPermissions = await Notifications.getPermissionsAsync();
        return requestPermissions.canAskAgain;
    }

    public static async pushNotificationsEnabled() {
        const permissions = await Notifications.getPermissionsAsync();
        return permissions.granted;
    }

    public static async requestPushNotificationAccess() {
        const answer = await Notifications.requestPermissionsAsync();
        return answer.granted;
    }
}

export namespace PushNotificationCustomHooks {
    export const useEnabled = () => {
        const [enabled, setEnabled] = React.useState<boolean>(false);

        React.useEffect(() => {
            updateEnabledState('');

            const result = AppState.addEventListener('change', updateEnabledState);
            return result.remove;
        }, []);

        const updateEnabledState = async (state: string) => {
            const enabled = await PushNotificationController.pushNotificationsEnabled();
            setEnabled(enabled);
        };

        return enabled;
    };

    export const useCanRequestPermission = () => {
        const [canRequest, setCanRequest] = React.useState<boolean>(false);

        React.useEffect(() => {
            const canRequest = async () => {
                const canRequest = await PushNotificationController.canRequestPushNotifications();
                setCanRequest(canRequest);
            };

            canRequest();
        }, []);

        return canRequest;
    };
}

export default PushNotificationController;
