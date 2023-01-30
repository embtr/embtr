import * as React from 'react';
import { NativeScrollEvent, RefreshControl, ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import DailyResultController, { DailyResultModel, PaginatedDailyResults } from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';
import { wait } from 'src/util/GeneralUtility';
import { getDateMinusDays, getDaysOld } from 'src/util/DateUtility';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import AccessLogController from 'src/controller/access_log/AccessLogController';
import GoalResultController, { PaginatedGoalResults } from 'src/controller/timeline/goals/GoalResultController';

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

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const INITIAL_DAYS = 5;

    const [paginatedTimelinePosts, setPaginatedTimelinePosts] = React.useState<PaginatedTimelinePosts>();
    const [paginatedDailyResults, setPaginatedDailyResults] = React.useState<PaginatedDailyResults>();
    const [paginatedGoalResults, setPaginatedGoalResults] = React.useState<PaginatedGoalResults>();
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoadingMode, setIsLoadingMode] = React.useState(false);
    const [lookbackDays, setLookbackDays] = React.useState(INITIAL_DAYS);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    React.useEffect(() => {
        addPageOfTimelinePosts();
    }, [lookbackDays, forceRefreshTimestamp]);

    React.useEffect(() => {
        addPageOfDailyResults();
    }, [lookbackDays, forceRefreshTimestamp]);

    React.useEffect(() => {
        addPageOfGoalResults();
    }, [lookbackDays, forceRefreshTimestamp]);

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    React.useEffect(() => {
        updateTimelineViews();
    }, [timelineProfiles]);

    React.useEffect(() => {
        fetchPostUsers();
    }, [paginatedTimelinePosts, paginatedDailyResults, paginatedGoalResults]);

    useFocusEffect(
        React.useCallback(() => {
            AccessLogController.addTimelinePageAccesLog();
        }, [])
    );

    const getLookbackDate = () => {
        const lookbackDate = getDateMinusDays(new Date(), lookbackDays);
        return lookbackDate;
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        //this will trigger a reset on all dependents
        setLookbackDays(INITIAL_DAYS);
        setForceRefreshTimestamp(new Date());

        setNotifications([]);
        fetchNotifications();
        wait(500).then(() => setRefreshing(false));
    }, []);

    const fetchNotifications = () => {
        NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
    };

    const fetchPostUsers = () => {
        let timelinePosts: TimelinePostModel[] = [];
        if (paginatedTimelinePosts?.posts) {
            timelinePosts = timelinePosts.concat(paginatedTimelinePosts.posts);
        }

        if (paginatedDailyResults?.results) {
            timelinePosts = timelinePosts.concat(paginatedDailyResults.results);
        }

        if (paginatedGoalResults?.results) {
            timelinePosts = timelinePosts.concat(paginatedGoalResults.results);
        }

        let uids: string[] = [];
        timelinePosts.forEach((timelineEntry) => {
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
    };

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

    const createGoalResultView = (timelineEntry: TimelinePostModel) => {
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

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        console.log(timelineEntry);
        switch (timelineEntry.type) {
            case 'STORY':
                return createStoryView(timelineEntry);

            case 'CHALLENGE':
                return createChallengeView(timelineEntry);

            case 'DAILY_RESULT':
                return createDailyResultView(timelineEntry);

            case 'GOAL_RESULT':
                return createGoalResultView(timelineEntry);

            default:
                return <View />;
        }
    };

    const updateTimelineViews = () => {
        let timelinePosts: TimelinePostModel[] = [];
        if (paginatedTimelinePosts?.posts) {
            timelinePosts = timelinePosts.concat(paginatedTimelinePosts.posts);
        }

        if (paginatedDailyResults?.results) {
            timelinePosts = timelinePosts.concat(paginatedDailyResults.results);
        }

        if (paginatedGoalResults?.results) {
            timelinePosts = timelinePosts.concat(paginatedGoalResults.results);
        }

        const handleSort = (postA: TimelinePostModel, postB: TimelinePostModel): number => {
            let postADate = postA.added.toDate();
            if (postA.type === 'DAILY_RESULT') {
                const dailyResult = postA as DailyResultModel;
                postADate = getDateFromDayKey(dailyResult.data.dayKey);
            }

            let postBDate = postB.added.toDate();
            if (postB.type === 'DAILY_RESULT') {
                const dailyResult = postB as DailyResultModel;
                postBDate = getDateFromDayKey(dailyResult.data.dayKey);
            }

            if (getDaysOld(postADate, new Date()) === getDaysOld(postBDate, new Date())) {
                postADate = postA.added.toDate();
                postBDate = postB.added.toDate();
            }

            return postBDate.getTime() - postADate.getTime();
        };
        timelinePosts.sort((a, b) => handleSort(a, b));

        let views: JSX.Element[] = [];
        timelinePosts.forEach((timelineEntry) => {
            const view: JSX.Element = createTimelineView(timelineEntry);
            views.push(view);
        });

        setTimelineViews(views);
    };

    const unreadNotificationCount = getUnreadNotificationCount(notifications);

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
        return layoutMeasurement.height + contentOffset.y > contentSize.height - 15;
    };

    const addPageOfTimelinePosts = () => {
        let currentTimelinePosts: PaginatedTimelinePosts = {
            posts: [],
            lastTimelinePost: undefined,
        };

        if (paginatedTimelinePosts?.posts && lookbackDays !== INITIAL_DAYS) {
            currentTimelinePosts.posts = [...paginatedTimelinePosts.posts];
            currentTimelinePosts.lastTimelinePost = paginatedTimelinePosts?.lastTimelinePost;
        }

        TimelineController.getPaginatedTimelinePosts(
            currentTimelinePosts?.lastTimelinePost,
            getLookbackDate(),
            (newPaginatedTimelinePosts: PaginatedTimelinePosts) => {
                if (newPaginatedTimelinePosts.posts.length > 0) {
                    currentTimelinePosts.posts = currentTimelinePosts.posts.concat(newPaginatedTimelinePosts.posts);
                    currentTimelinePosts.lastTimelinePost = newPaginatedTimelinePosts.lastTimelinePost;
                }

                setPaginatedTimelinePosts(currentTimelinePosts);
            }
        );
    };

    const addPageOfDailyResults = async () => {
        let currentDailyResults: PaginatedDailyResults = {
            results: [],
            lastDailyResult: undefined,
        };

        if (paginatedDailyResults?.results && lookbackDays !== INITIAL_DAYS) {
            currentDailyResults.results = [...paginatedDailyResults.results];
            currentDailyResults.lastDailyResult = paginatedDailyResults?.lastDailyResult;
        }

        const newPaginatedDailyResults = await DailyResultController.getPaginatedFinished(currentDailyResults.lastDailyResult, getLookbackDate());
        if (newPaginatedDailyResults.results.length > 0) {
            currentDailyResults.results = currentDailyResults.results.concat(newPaginatedDailyResults.results);
            currentDailyResults.lastDailyResult = newPaginatedDailyResults.lastDailyResult;
        }

        setPaginatedDailyResults(currentDailyResults);
    };

    const addPageOfGoalResults = async () => {
        let currentGoalResults: PaginatedGoalResults = {
            results: [],
            lastGoalResult: undefined,
        };

        if (paginatedGoalResults?.results && lookbackDays !== INITIAL_DAYS) {
            currentGoalResults.results = [...paginatedGoalResults.results];
            currentGoalResults.lastGoalResult = paginatedGoalResults?.lastGoalResult;
        }

        const newPaginatedGoalResults = await GoalResultController.getPaginated(currentGoalResults.lastGoalResult, getLookbackDate());
        const newPaginatedDailyResults = await DailyResultController.getPaginatedFinished(currentGoalResults.lastGoalResult, getLookbackDate());
        if (newPaginatedDailyResults.results.length > 0) {
            currentGoalResults.results = currentGoalResults.results.concat(newPaginatedGoalResults.results);
            currentGoalResults.lastGoalResult = newPaginatedDailyResults.lastDailyResult;
        }

        setPaginatedGoalResults(currentGoalResults);
    };

    const loadMore = () => {
        if (isLoadingMode) {
            return;
        }

        setIsLoadingMode(true);
        setLookbackDays(lookbackDays + 3);
        wait(500).then(() => setIsLoadingMode(false));
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
                overScrollMode="always"
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        loadMore();
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
