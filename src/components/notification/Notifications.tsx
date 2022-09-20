import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import NotificationController, { NotificationModel } from 'src/controller/notification/NotificationController';
import { Notification } from 'src/components/notification/Notification';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';

export const Notifications = () => {
    const { colors } = useTheme();

    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [userProfiles, setUserProfiles] = React.useState<UserProfileModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (notifications.length == 0) {
                return;
            }

            let profileIds: string[] = [];
            notifications.forEach((notification) => {
                if (!profileIds.includes(notification.notifier_uid)) {
                    profileIds.push(notification.notifier_uid);
                }
            });

            ProfileController.getProfiles(profileIds, setUserProfiles);
        }, [notifications])
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
        notifications.forEach((notification) => {
            if (!notification.read) {
                containsUnread = true;
            }
        });

        return containsUnread;
    };

    let notificationViews: JSX.Element[] = [];
    if (notifications.length > 0 && userProfiles.length > 0) {
    console.log("got notifications and profiles")
        notifications.forEach((notification) => {
            userProfiles.forEach((userProfile) => {
                if (notification.notifier_uid === userProfile.uid) {
                    notificationViews.push(
                        <View key={notification.id} style={{ paddingBottom: 5 }}>
                            <Notification userProfile={userProfile} notification={notification} />
                        </View>
                    );
                    return;
                }
            });
        });
    }

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute={'BACK'} />

            <ScrollView style={{ backgroundColor: colors.background_medium }}>{notificationViews}</ScrollView>
        </Screen>
    );
};
