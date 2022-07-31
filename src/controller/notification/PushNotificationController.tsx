import * as Notifications from 'expo-notifications';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { User } from 'firebase/auth';
import EmbtrCloudApiController from 'src/controller/embtr_cloud/EmbtrCloudApiController';
import { Linking } from 'react-native';
import { isAndroidDevice, isPhysicalDevice } from 'src/util/DeviceUtil';

class PushNotificationController {
    public static registerUpdatePostNotificationTokenListener() {
        registerAuthStateListener((user: User) => {
            if (user) {
                this.registerForPushNotificationsAsync();
            }
        });
    }

    public static sendPostNotificationApiRequest(notificationId: string) {
        EmbtrCloudApiController.sendPostNotificationApiRequest(notificationId);
    }

    private static registerForPushNotificationsAsync = async () => {
        const pushNotificationsEnabled = await this.pushNotificationsEnabled();
        if (pushNotificationsEnabled) {
            return;
        }

        const pushNotificationsManuallyDisabled = await this.pushNotificationsManuallyDisabled();
        if (pushNotificationsManuallyDisabled === true) {
            return;
        }

        if (!isPhysicalDevice()) {
            return;
        }

        const requestPermissions = await Notifications.requestPermissionsAsync();
        if (!requestPermissions.canAskAgain) {
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        UserController.updatePostNotificationToken(token);

        if (isAndroidDevice()) {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    private static async openNotificationsSettings() {
        await Linking.openSettings();
    }

    public static async pushNotificationsManuallyDisabled() {
        const user: UserModel = await UserController.getCurrentUser();
        return user.post_notification_token === null;
    }

    public static async pushNotificationsAllowedOnSystemLevel() {
        const requestPermissions = await Notifications.getPermissionsAsync();
        return requestPermissions.canAskAgain;
    }

    public static async pushNotificationsEnabled() {
        const permissions = await Notifications.getPermissionsAsync();
        if (permissions.status !== "granted") {
            return false;
        }

        const manuallyDisabled = await this.pushNotificationsManuallyDisabled();
        return manuallyDisabled === false;
    }

    public static async addPushNotificationAccess() {
        const answer = await Notifications.requestPermissionsAsync();
        if (answer.status === "granted") {
            const token = await Notifications.getExpoPushTokenAsync();
            UserController.updatePostNotificationToken(token.data);
            return true;
        } else {
            this.openNotificationsSettings();
            return false;
        }
    }

    public static async removePushNotificationAccess() {
        await UserController.updatePostNotificationToken(null);
    }
}

export default PushNotificationController;