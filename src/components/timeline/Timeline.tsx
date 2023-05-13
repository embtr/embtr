import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import NotificationController, {
    getUnreadNotificationCount,
} from 'src/controller/notification/NotificationController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { Notification as NotificationModel, PlannedDayResult, UserPost } from 'resources/schema';
import { FilteredTimeline } from './FilteredTimeline';
import StoryController from 'src/controller/timeline/story/StoryController';

export const Timeline = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResult[]>([]);
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const getDateMinusDays = (date: Date, days: number) => {
        date.setDate(date.getDate() - days);
        return date;
    };

    const [bounds, setBounds] = React.useState<{ upperBound: Date; lowerBound: Date }>({
        upperBound: getDateMinusDays(new Date(), 0),
        lowerBound: getDateMinusDays(new Date(), 2),
    });

    useFocusEffect(
        React.useCallback(() => {
            loadMore(false);
            fetchNotifications();
        }, [])
    );

    const fetchNotifications = async () => {
        const notifications = await NotificationController.getNotificationsViaApi();
        setNotifications(notifications);
    };

    const unreadNotificationCount = getUnreadNotificationCount(notifications);

    const loadMore = (refresh: boolean): Promise<void> => {
        if (refresh) {
            setRefreshing(true);
        }

        const upperBound = refresh ? new Date() : bounds.upperBound;
        const lowerBound = refresh ? getDateMinusDays(new Date(), 2) : bounds.lowerBound;

        const dailyResultsPromise = DailyResultController.getAllViaApi(upperBound, lowerBound);
        const userPostsPromise = StoryController.getAllViaApi(upperBound, lowerBound);

        const combinedPromise = Promise.all([dailyResultsPromise, userPostsPromise]).then(
            ([newDayResults, newUserPosts]) => {
                setDayResults(!refresh ? [...dayResults, ...newDayResults] : newDayResults);
                setUserPosts(!refresh ? [...userPosts, ...newUserPosts] : newUserPosts);

                const newUpperBound = getDateMinusDays(upperBound, 2);
                const newLowerBound = getDateMinusDays(lowerBound, 2);
                setBounds({ upperBound: newUpperBound, lowerBound: newLowerBound });

                if (refresh) {
                    setRefreshing(false);
                }
            }
        );

        return combinedPromise;
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
            <FilteredTimeline
                userPosts={userPosts}
                dayResults={dayResults}
                refreshing={refreshing}
                loadMore={loadMore}
            />
        </Screen>
    );
};
