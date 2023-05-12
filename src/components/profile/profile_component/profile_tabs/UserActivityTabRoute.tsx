import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import StoryController from 'src/controller/timeline/story/StoryController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { wait } from 'src/util/GeneralUtility';
import { PlannedDayResult, User, UserPost } from 'resources/schema';
import { FilteredTimeline } from 'src/components/timeline/FilteredTimeline';

interface Props {
    user: User;
}

export const UserActivityTabRoute = ({ user }: Props) => {
    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResult[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    useFocusEffect(
        React.useCallback(() => {
            getUserPosts();
            getPlannedDayResults();
        }, [forceRefreshTimestamp])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        //this will trigger a reset on all dependents
        setForceRefreshTimestamp(new Date());
        wait(500).then(() => setRefreshing(false));
    }, []);

    const getUserPosts = async () => {
        if (!user.id) {
            return;
        }

        const userPosts = await StoryController.getAllForUser(user.id);
        setUserPosts(userPosts);
    };

    const getPlannedDayResults = async () => {
        if (!user.id) {
            return;
        }

        const dayResults = await DailyResultController.getAllForUser(user.id);
        setDayResults(dayResults);
    };

    return (
        <FilteredTimeline
            userPosts={userPosts}
            dayResults={dayResults}
            refreshing={refreshing}
            onRefresh={onRefresh}
            loadMore={() => {}}
        />
    );
};
