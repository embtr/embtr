import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import NotificationController, { getUnreadNotificationCount } from 'src/controller/notification/NotificationController';
import StoryController from 'src/controller/timeline/story/StoryController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { wait } from 'src/util/GeneralUtility';
import { Notification as NotificationModel, PlannedDayResult, UserPost } from 'resources/schema';
import { FilteredTimeline } from './FilteredTimeline';

export const Timeline = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResult[]>([]);
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    useFocusEffect(
        React.useCallback(() => {
            getUserPosts();
            getPlannedDayResults();
            fetchNotifications();
        }, [forceRefreshTimestamp])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        //this will trigger a reset on all dependents
        setForceRefreshTimestamp(new Date());

        setNotifications([]);
        fetchNotifications();
        wait(500).then(() => setRefreshing(false));
    }, []);

    const fetchNotifications = async () => {
        const notifications = await NotificationController.getNotificationsViaApi();
        setNotifications(notifications);
    };

    const unreadNotificationCount = getUnreadNotificationCount(notifications);

    const getUserPosts = async () => {
        const userPosts = await StoryController.getAllViaApi();
        setUserPosts(userPosts);
    };

    const getPlannedDayResults = async () => {
        const dayResults = await DailyResultController.getAllViaApi();
        setDayResults(dayResults);
    };

    return (
        <Screen>
            <Banner
                name="Timeline"
                leftIcon={'people-outline'}
                leftRoute={'UserSearch'}
                innerLeftIcon={'add-outline'}
                innerLeftOnClick={() => {
                    navigation.navigate('CreateUserPost');
                }}
                innerRightIcon={'globe-outline'}
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
                rightIconNotificationCount={unreadNotificationCount}
            />
            <FilteredTimeline userPosts={userPosts} dayResults={dayResults} refreshing={refreshing} onRefresh={onRefresh} />
        </Screen>
    );
};
