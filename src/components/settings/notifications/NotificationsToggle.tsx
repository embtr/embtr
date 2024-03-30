import * as React from 'react';
import { AppState, View, Switch } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PushNotificationController from 'src/controller/notification/PushNotificationController';

export const NotificationsToggle = () => {
    const colors = useTheme().colors;

    const [pushNotificationsEnabled, setPushNotificationsEnabled] = React.useState<boolean>();
    const [pendingEnableNotification, setPendingEnableNotification] =
        React.useState<boolean>(false);

    React.useEffect(() => {
        const result = AppState.addEventListener('change', appStateChanged);
        return result.remove;
    }, []);

    const appStateChanged = async (newState: string) => {
        const systemEnabled =
            await PushNotificationController.pushNotificationsAllowedOnSystemLevel();
        if (!systemEnabled) {
            setPushNotificationsEnabled(false);
        } else {
            const manuallyDisabled =
                await PushNotificationController.pushNotificationsManuallyDisabled();
            setPushNotificationsEnabled(!manuallyDisabled);
        }

        if (newState === 'active' && pendingEnableNotification) {
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
    };

    const toggleNotificationPermission = async (newState: boolean) => {
        if (newState) {
            const successfullyAddedPushNotificationAccess =
                await PushNotificationController.addPushNotificationAccess();
            setPendingEnableNotification(!successfullyAddedPushNotificationAccess);
        } else {
            PushNotificationController.removePushNotificationAccess();
        }
        setPushNotificationsEnabled(newState);
    };

    getInitialPushNotificationSettings();

    return pushNotificationsEnabled !== undefined ? (
        <Switch
            style={{ height: 30, bottom: 2 }}
            trackColor={{
                false: colors.toggle_background_unselected,
                true: colors.accent_color_light,
            }}
            thumbColor={colors.toggle}
            ios_backgroundColor={colors.toggle_background_unselected}
            onValueChange={(value) => toggleNotificationPermission(value)}
            value={pushNotificationsEnabled}
        />
    ) : (
        <View />
    );
};
