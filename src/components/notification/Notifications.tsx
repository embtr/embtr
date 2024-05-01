import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, View, Text } from 'react-native';
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
import { useTheme } from '../theme/ThemeProvider';

export const Notifications = () => {
    const colors = useTheme().colors;
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

    const noNotifications = (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.secondary_text }}>you have no notifications</Text>
        </View>
    );

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute={'BACK'} />

            {!notifications.isLoading && notifications.data?.length === 0 && noNotifications}

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {notificationViews}
            </ScrollView>
        </Screen>
    );
};
