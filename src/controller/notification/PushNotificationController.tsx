import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import UserController from 'src/controller/user/UserController';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { User } from 'firebase/auth';
import EmbtrCloudApiController from 'src/controller/embtr_cloud/EmbtrCloudApiController';
import { Platform } from 'react-native';

class PushNotificationController {
    public static registerUpdatePostNotificationTokenListener() {
        registerAuthStateListener((user: User) => {
            if (user) {
                this.registerForPushNotificationsAsync();
            }
        });
    }

    public static sendPostNotificationApiRequest(notificationId: string) {
        console.log("sending notification with id: " + notificationId);
        EmbtrCloudApiController.sendPostNotificationApiRequest(notificationId);
    }

    private static registerForPushNotificationsAsync = async () => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            alert("successfully got token: " + token);
            //setExpoPushToken(token);
            UserController.updatePostNotificationToken(token, () => { });
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };
}

export default PushNotificationController;