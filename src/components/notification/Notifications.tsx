import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { Notification } from 'src/components/notification/Notification';
import { CARD_SHADOW } from 'src/util/constants';
import { wait } from 'src/util/GeneralUtility';
import {
    NotificationController,
    NotificationCustomHooks,
} from 'src/controller/notification/NotificationController';

export const Notifications = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const notifications = NotificationCustomHooks.useNotifications();
    const unreadNotificationCount = NotificationCustomHooks.useUnreadNotificationCount();

    useFocusEffect(
        React.useCallback(() => {
            const shouldClearNotifications = unreadNotificationCount.data ?? 0 > 0;
            if (shouldClearNotifications) {
                NotificationController.clearAll();
            }
        }, [unreadNotificationCount.data])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        //TODO update here
        wait(500).then(() => setRefreshing(false));
    }, []);

    let notificationViews: JSX.Element[] = [];
    notifications.data?.forEach((notification) => {
        notificationViews.push(
            <View key={notification.id} style={[{ paddingTop: 5, paddingBottom: 5 }, CARD_SHADOW]}>
                <Notification notification={notification} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute={'BACK'} />

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {notificationViews}
            </ScrollView>
        </Screen>
    );
};
