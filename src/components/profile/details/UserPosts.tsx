import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import StoryController from 'src/controller/timeline/story/StoryController';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { UserPost } from 'resources/schema';
import { wait } from 'src/util/GeneralUtility';
import { UserProfileTimeline } from 'src/components/timeline/UserProfileTimeline';
import { FilteredTimeline } from 'src/components/timeline/FilteredTimeline';

export const UserPosts = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPosts'>>();
    const userId = route.params.userId;

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    useFocusEffect(
        React.useCallback(() => {
            getUserPosts();
        }, [forceRefreshTimestamp])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        getUserPosts();
        wait(500).then(() => setRefreshing(false));
    }, []);

    const getUserPosts = async () => {
        const userPosts = await StoryController.getAllForUser(userId);
        setUserPosts(userPosts);
    };

    return (
        <Screen>
            <Banner name="User Posts" leftText="back" leftRoute="BACK" />

            <ScrollView>
                <FilteredTimeline
                    userPosts={userPosts}
                    plannedDayResultSummaries={[]}
                    joinedChallenges={[]}
                    refreshing={refreshing}
                    loadMore={() => {}}
                />
                {userPosts.length === 0 && (
                    <ActivityIndicator color="#fff" animating size="large" />
                )}
                <View style={{ height: 10 }} />
            </ScrollView>
        </Screen>
    );
};
