import * as Notifications from 'expo-notifications';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { User } from 'firebase/auth';
import { Linking } from 'react-native';
import { isAndroidDevice, isPhysicalDevice } from 'src/util/DeviceUtil';
import { darkColors } from 'src/theme/ColorThemes';
import { UpdateUserRequest } from 'resources/types/requests/UserTypes';

class PushNotificationController {
    public static registerUpdatePostNotificationTokenListener() {
        registerAuthStateListener((user: User) => {
            if (user) {
                this.registerForPushNotificationsAsync();
            }
        });
    }

    private static registerForPushNotificationsAsync = async () => {
        if (!isPhysicalDevice()) {
            return;
        }

        //const pushNotificationsEnabled = await this.pushNotificationsEnabled();
        //if (pushNotificationsEnabled) {
        //    return;
        //}

        //const pushNotificationsManuallyDisabled = await this.pushNotificationsManuallyDisabled();
        //if (pushNotificationsManuallyDisabled === true) {
        //    return;
        //}

        const requestPermissions = await Notifications.requestPermissionsAsync();
        if (!requestPermissions.canAskAgain) {
            return;
        }

        if (isAndroidDevice()) {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: darkColors.primary_border,
            });
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;

        console.log(
            'PushNotificationController.registerForPushNotificationsAsync: token: ' + token
        );
        this.addPushNotificationTokenViaApi(token);
    };

    private static async addPushNotificationTokenViaApi(token: string) {
        const updateUserRequest: UpdateUserRequest = {
            pushNotificationTokens: [{ token }],
        };

        await UserController.updateUserViaApi(updateUserRequest);
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
