import { View, ScrollView, ActivityIndicator } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import StoryController from 'src/controller/timeline/story/StoryController';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { PlannedDayResult, UserPost } from 'resources/schema';
import { wait } from 'src/util/GeneralUtility';
import { UserProfileTimeline } from 'src/components/timeline/UserProfileTimeline';

export const UserPosts = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPosts'>>();
    const userId = route.params.userId;

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResult[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    useFocusEffect(
        React.useCallback(() => {
            getUserPosts();
            //getPlannedDayResults();
        }, [forceRefreshTimestamp])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        //this will trigger a reset on all dependents
        setForceRefreshTimestamp(new Date());
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
                <UserProfileTimeline
                    userPosts={userPosts}
                    dayResults={dayResults}
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
