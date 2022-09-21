import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import NotificationController, { NotificationModel } from 'src/controller/notification/NotificationController';
import { Notification } from 'src/components/notification/Notification';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { CARD_SHADOW } from 'src/util/constants';

export const Notifications = () => {
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
        for (let i = 0; i < notifications.length; i++) {
            const notification = notifications[i];

            userProfiles.forEach((userProfile) => {
                if (notification.notifier_uid === userProfile.uid) {
                    notificationViews.push(
                        <View key={notification.id} style={[{ paddingTop: 5, paddingBottom: i === notifications.length - 1 ? 5 : 0 }, CARD_SHADOW]}>
                            <Notification userProfile={userProfile} notification={notification} />
                        </View>
                    );
                    return;
                }
            });
        }
    }

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute={'BACK'} />
            <ScrollView>{notificationViews}</ScrollView>
        </Screen>
    );
};
