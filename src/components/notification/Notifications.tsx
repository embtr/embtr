import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import NotificationController, { NotificationModel } from 'src/controller/notification/NotificationController';
import { Notification } from 'src/components/notification/Notification';

export const Notifications = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const shouldClearNotifications = containsUnreadNotification();
            if (shouldClearNotifications) {
                NotificationController.clearNotifications(notifications);
            }
        }, [notifications])
    );

    const containsUnreadNotification = (): boolean => {
        let containsUnread = false;
        notifications.forEach(notification => {
            if (!notification.read) {
                containsUnread = true;
            }
        });

        return containsUnread;
    }

    let notificationViews: JSX.Element[] = [];
    notifications.forEach(notification => {
        notificationViews.push(
            <View key={notification.id} style={{ paddingBottom: 5 }}>
                <Notification notification={notification} />
            </View>

        );
    });

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <ScrollView style={{ backgroundColor: colors.background_medium }}>
                {notificationViews}
            </ScrollView>
        </Screen>
    );
};