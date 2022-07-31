import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { AppState } from 'react-native';
import { View } from 'react-native';
import { EmbtrToggle } from 'src/components/common/toggle/EmbtrToggle';
import PushNotificationController from 'src/controller/notification/PushNotificationController';


export const NotificationsToggle = () => {
    const [pushNotificationsEnabled, setPushNotificationsEnabled] = React.useState<boolean>();
    const [pendingEnableNotification, setPendingEnableNotification] = React.useState<boolean>(false);

    React.useEffect(() => {
        const result = AppState.addEventListener('change', appStateChanged);
        return result.remove;
    }, []);

    const appStateChanged = async (newState: string) => {
        const systemEnabled = await PushNotificationController.pushNotificationsAllowedOnSystemLevel();
        if (!systemEnabled) {
            setPushNotificationsEnabled(false);
        } else {
            const manuallyDisabled = await PushNotificationController.pushNotificationsManuallyDisabled();
            setPushNotificationsEnabled(!manuallyDisabled);
        }

        if (newState === "active" && pendingEnableNotification) {
            if (systemEnabled) {
                const success = await PushNotificationController.addPushNotificationAccess();
                setPushNotificationsEnabled(success);
            }

            setPendingEnableNotification(false);
        }
    };

    const getInitialPushNotificationSettings = async () => {
        const notificationsEnabled = await PushNotificationController.pushNotificationsEnabled();
        setPushNotificationsEnabled(notificationsEnabled);
    }

    const toggleNotificationPermission = async (newState: boolean) => {
        if (newState) {
            const successfullyAddedPushNotificationAccess = await PushNotificationController.addPushNotificationAccess();
            setPendingEnableNotification(!successfullyAddedPushNotificationAccess);
        } else {
            PushNotificationController.removePushNotificationAccess();
        }
        setPushNotificationsEnabled(newState);
    };

    getInitialPushNotificationSettings();

    return (
        pushNotificationsEnabled !== undefined ? <EmbtrToggle text={"Notifications"} onToggle={toggleNotificationPermission} value={pushNotificationsEnabled} /> : <View />
    );
}