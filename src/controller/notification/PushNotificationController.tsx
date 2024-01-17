import * as Notifications from 'expo-notifications';
import UserController from 'src/controller/user/UserController';
import { Linking } from 'react-native';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { darkColors } from 'src/theme/ColorThemes';
import { User } from 'resources/schema';
import Constants from 'expo-constants';
import { CreatePushNotificationTokenRequest } from 'resources/types/requests/NotificationTypes';
import axiosInstance from 'src/axios/axios';

class PushNotificationController {
    public static registerPushNotificationToken = async () => {
        await PushNotificationController.setAndroidNotificationChannel();

        const isAllowedToRequestNotificationToken =
            await PushNotificationController.isAllowedToRequestNotificationToken();
        if (!isAllowedToRequestNotificationToken) {
            return;
        }

        const token = await PushNotificationController.getPushNotificationToken();
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
        const token = (
            await Notifications.getExpoPushTokenAsync({
                projectId: Constants.easConfig?.projectId,
            })
        ).data;

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
            .post(`/user/registerPushNotificationToken/v1/`, request)
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

    private static async openNotificationsSettings() {
        await Linking.openSettings();
    }

    public static async pushNotificationsManuallyDisabled() {
        return false;
    }

    public static async pushNotificationsAllowedOnSystemLevel() {
        const requestPermissions = await Notifications.getPermissionsAsync();
        return requestPermissions.canAskAgain;
    }

    public static async pushNotificationsEnabled() {
        const permissions = await Notifications.getPermissionsAsync();
        return permissions.status === 'granted';
    }

    public static async addPushNotificationAccess() {
        const answer = await Notifications.requestPermissionsAsync();
        if (answer.status === 'granted') {
            const token = await Notifications.getExpoPushTokenAsync();
            //UserController.updatePostNotificationToken(token.data);
            return true;
        } else {
            this.openNotificationsSettings();
            return false;
        }
    }

    public static async removePushNotificationAccess() {
        //await UserController.updatePostNotificationToken(null);
    }
}

export default PushNotificationController;
