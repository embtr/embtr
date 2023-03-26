import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import NotificationController from 'src/controller/notification/NotificationController';
import { Notification } from 'src/components/notification/Notification';
import { CARD_SHADOW } from 'src/util/constants';
import { wait } from 'src/util/GeneralUtility';
import { Notification as NotificationModel } from 'resources/schema';

export const Notifications = () => {
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const shouldClearNotifications = notifications.filter((notification) => !notification.read).length > 0;
            if (shouldClearNotifications) {
                NotificationController.clearNotificationsViaApi(notifications);
            }
        }, [notifications])
    );

    const fetch = async () => {
        const notifications = await NotificationController.getNotificationsViaApi();
        setNotifications(notifications);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetch();
        wait(500).then(() => setRefreshing(false));
    }, []);

    let notificationViews: JSX.Element[] = [];
    notifications.forEach((notification) => {
        notificationViews.push(
            <View key={notification.id} style={[{ paddingTop: 5, paddingBottom: 5 }, CARD_SHADOW]}>
                <Notification notification={notification} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute={'BACK'} />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>{notificationViews}</ScrollView>
        </Screen>
    );
};
