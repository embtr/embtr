import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import NotificationController, {
    getUnreadNotificationCount,
} from 'src/controller/notification/NotificationController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { JoinedChallenge, Notification as NotificationModel, UserPost } from 'resources/schema';
import { FilteredTimeline } from './FilteredTimeline';
import StoryController from 'src/controller/timeline/story/StoryController';
import { getTimelineDays } from 'src/redux/user/GlobalState';
import { useAppSelector } from 'src/redux/Hooks';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';

export const Timeline = () => {
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResultSummary[]>([]);
    const [joinedChallenges, setJoinedChallenges] = React.useState<JoinedChallenge[]>([]);
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const refreshDays = useAppSelector(getTimelineDays);
    const getDateMinusDays = (date: Date, days: number) => {
        date.setDate(date.getDate() - days);
        return date;
    };

    const [bounds, setBounds] = React.useState<{ upperBound: Date; lowerBound: Date }>({
        upperBound: getDateMinusDays(new Date(), 0),
        lowerBound: getDateMinusDays(new Date(), refreshDays),
    });

    React.useEffect(() => {
        loadMore(false);
        fetchNotifications();
    }, []);

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
        const lowerBound = refresh ? getDateMinusDays(new Date(), refreshDays) : bounds.lowerBound;

        const userPostsPromise = StoryController.getAllViaApi(upperBound, lowerBound);
        const dailyResultsPromise = DailyResultController.getAllSummaries(upperBound, lowerBound);
        const joinedChallengesPromise = ChallengeController.getAllRecentJoined(
            upperBound,
            lowerBound
        );

        const combinedPromise = Promise.all([
            dailyResultsPromise,
            userPostsPromise,
            joinedChallengesPromise,
        ]).then(([newDayResults, newUserPosts, newJoinedChallenges]) => {
            setUserPosts(!refresh ? [...userPosts, ...newUserPosts] : newUserPosts);
            setDayResults(!refresh ? [...dayResults, ...newDayResults] : newDayResults);
            setJoinedChallenges(
                !refresh ? [...joinedChallenges, ...newJoinedChallenges] : newJoinedChallenges
            );

            const newUpperBound = getDateMinusDays(upperBound, refreshDays);
            const newLowerBound = getDateMinusDays(lowerBound, refreshDays);
            setBounds({ upperBound: newUpperBound, lowerBound: newLowerBound });

            if (refresh) {
                setRefreshing(false);
            }
        });

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
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
                rightIconNotificationCount={unreadNotificationCount}
            />
            <FilteredTimeline
                userPosts={userPosts}
                plannedDayResultSummaries={dayResults}
                joinedChallenges={joinedChallenges}
                refreshing={refreshing}
                loadMore={loadMore}
            />
        </Screen>
    );
};
