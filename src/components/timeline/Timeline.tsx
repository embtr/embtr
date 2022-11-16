import * as React from 'react';
import { NativeScrollEvent, RefreshControl, ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TimelineController, { PaginatedTimelinePosts, TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';
import NotificationController, { getUnreadNotificationCount, NotificationModel } from 'src/controller/notification/NotificationController';
import { getAuth } from 'firebase/auth';
import { CARD_SHADOW } from 'src/util/constants';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';

export const Timeline = () => {
    const { colors } = useTheme();

    const card = {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    };

    const challengeShadow = {
        shadowColor: 'orange',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    };

    const [paginatedTimelinePosts, setPaginatedTimelinePosts] = React.useState<PaginatedTimelinePosts>();
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {
        TimelineController.getPaginatedTimelinePosts(undefined, undefined, 10, setPaginatedTimelinePosts);
    }, []);

    React.useEffect(() => {
        NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
    }, []);

    React.useEffect(() => {
        let uids: string[] = [];
        paginatedTimelinePosts?.posts.forEach((timelineEntry) => {
            if (!uids.includes(timelineEntry.uid)) {
                uids.push(timelineEntry.uid);
            }
        });

        ProfileController.getProfiles(uids, (profiles: UserProfileModel[]) => {
            let profileMap = new Map<string, UserProfileModel>();
            profiles.forEach((profile) => {
                profileMap.set(profile.uid!, profile);
            });

            setTimelineProfiles(profileMap);
        });
    }, [paginatedTimelinePosts]);

    const wait = (timeout: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        TimelineController.getPaginatedTimelinePosts(undefined, undefined, 10, setPaginatedTimelinePosts);
        NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
        wait(500).then(() => setRefreshing(false));
    }, []);

    const createStoryView = (timelineEntry: TimelinePostModel) => {
        const profile = timelineProfiles.get(timelineEntry.uid);
        if (profile) {
            return (
                <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                    <UserTextCard userProfileModel={profile} story={timelineEntry as StoryModel} />
                </View>
            );
        }

        return <View />;
    };

    const createChallengeView = (timelineEntry: TimelinePostModel) => {
        return (
            <View key={timelineEntry.id} style={[card, challengeShadow]}>
                <EmbtrTextCard challengeModel={timelineEntry as ChallengeModel1} />
            </View>
        );
    };

    const createDailyResultView = (timelineEntry: TimelinePostModel) => {
        const profile = timelineProfiles.get(timelineEntry.uid);

        if (profile) {
            return (
                <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                    <DailyResultCard dailyResult={timelineEntry as DailyResultModel} userProfileModel={profile} />
                </View>
            );
        }

        return <View />;
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case 'STORY':
                return createStoryView(timelineEntry);

            case 'CHALLENGE':
                return createChallengeView(timelineEntry);

            case 'DAILY_RESULT':
                return createDailyResultView(timelineEntry);

            default:
                return <View />;
        }
    };

    React.useEffect(() => {
        let views: JSX.Element[] = [];
        paginatedTimelinePosts?.posts.forEach((timelineEntry) => {
            const view: JSX.Element = createTimelineView(timelineEntry);
            views.push(view);
        });

        setTimelineViews(views);
    }, [timelineProfiles]);

    const unreadNotificationCount = getUnreadNotificationCount(notifications);

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    };

    const loadMore = () => {
        //TimelineController.getTimelinePostsFromPage(setTimelineEntries, lastReturnedTimelinePost, lastReturnedDailyResult);
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

            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        console.log('at bottom!');
                    }
                }}
                scrollEventThrottle={8}
                keyboardShouldPersistTaps={'handled'}
                style={{ backgroundColor: colors.background }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ flex: 1 }}>{timelineViews}</View>
            </ScrollView>
        </Screen>
    );
};
