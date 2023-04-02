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
import { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';
import NotificationController, { getUnreadNotificationCount } from 'src/controller/notification/NotificationController';
import { CARD_SHADOW } from 'src/util/constants';
import StoryController, { StoryModel } from 'src/controller/timeline/story/StoryController';
import DailyResultController, { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';
import { wait } from 'src/util/GeneralUtility';
import { getDateMinusDays } from 'src/util/DateUtility';
import GoalResultController, { GoalResultModel, PaginatedGoalResults } from 'src/controller/timeline/goals/GoalResultController';
import { GoalResultCard } from '../common/timeline/GoalResultCard';
import { Notification as NotificationModel, PlannedDayResult as PlannedDayResultModel, UserPost } from 'resources/schema';
import { Timestamp } from 'firebase/firestore';

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

    const [userPosts, setUserPosts] = React.useState<UserPost[]>([]);
    const [dayResults, setDayResults] = React.useState<PlannedDayResultModel[]>([]);
    const [paginatedGoalResults, setPaginatedGoalResults] = React.useState<PaginatedGoalResults>();
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoadingMode, setIsLoadingMode] = React.useState(false);
    const [lookbackDays, setLookbackDays] = React.useState(INITIAL_DAYS);
    const [forceRefreshTimestamp, setForceRefreshTimestamp] = React.useState(new Date());

    React.useEffect(() => {
        getUserPosts();
    }, [lookbackDays, forceRefreshTimestamp]);

    React.useEffect(() => {
        getPlannedDayResults();
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
    }, [userPosts, dayResults, paginatedGoalResults]);

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

    const fetchNotifications = async () => {
        const notifications = await NotificationController.getNotificationsViaApi();
        setNotifications(notifications);
    };

    const fetchPostUsers = () => {
        let timelinePosts: TimelinePostModel[] = [];

        if (userPosts.length > 0) {
            const userPostTimelinePosts: TimelinePostModel[] = userPosts.map((userPost: UserPost) => {
                console.log('userPost', userPost);
                const userPostTimelinePost: TimelinePostModel = {
                    added: Timestamp.fromDate(userPost.createdAt!),
                    modified: Timestamp.fromDate(userPost.updatedAt!),
                    type: 'STORY',
                    uid: userPost.user!.uid!,
                    public: {
                        comments: [],
                        likes: [],
                    },
                    data: {
                        userPost: userPost,
                    },
                    active: true,
                };

                return userPostTimelinePost;
            });

            timelinePosts = timelinePosts.concat(userPostTimelinePosts);
        }

        if (dayResults.length > 0) {
            const dayResultTimelinePosts: DayResultTimelinePost[] = dayResults.map((dayResult: PlannedDayResultModel) => {
                const dayResultTimelinePost: DayResultTimelinePost = {
                    added: Timestamp.fromDate(dayResult.createdAt!),
                    modified: Timestamp.fromDate(dayResult.updatedAt!),
                    type: 'DAILY_RESULT',
                    uid: dayResult.plannedDay!.user!.uid!,
                    public: {
                        comments: [],
                        likes: [],
                    },
                    data: {
                        dayResult: dayResult,
                    },
                    active: true,
                };

                return dayResultTimelinePost;
            });

            timelinePosts = timelinePosts.concat(dayResultTimelinePosts);
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

    const createUserPostView = (timelineEntry: TimelinePostModel) => {
        const profile = timelineProfiles.get(timelineEntry.uid);
        if (profile) {
            return (
                <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                    <UserTextCard userProfileModel={profile} oldModel={timelineEntry as StoryModel} />
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
                    <DailyResultCard plannedDayResult={timelineEntry as DayResultTimelinePost} userProfileModel={profile} />
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
                    <GoalResultCard userProfileModel={profile} goalResult={timelineEntry as GoalResultModel} />
                </View>
            );
        }

        return <View />;
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case 'STORY':
                return createUserPostView(timelineEntry);

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

        const userPostTimelinePosts: TimelinePostModel[] = userPosts.map((userPost: UserPost) => {
            const userPostTimelinePost: TimelinePostModel = {
                added: Timestamp.fromDate(userPost.createdAt!),
                modified: Timestamp.fromDate(userPost.updatedAt!),
                type: 'STORY',
                uid: userPost.user!.uid!,
                public: {
                    comments: [],
                    likes: [],
                },
                data: {
                    userPost: userPost,
                },
                active: true,
            };

            return userPostTimelinePost;
        });
        timelinePosts = timelinePosts.concat(userPostTimelinePosts);

        const dayResultTimelinePosts: DayResultTimelinePost[] = dayResults.map((dayResult: PlannedDayResultModel) => {
            const dayResultTimelinePost: DayResultTimelinePost = {
                added: Timestamp.fromDate(dayResult.createdAt!),
                modified: Timestamp.fromDate(dayResult.updatedAt!),
                type: 'DAILY_RESULT',
                uid: dayResult.plannedDay!.user!.uid!,
                public: {
                    comments: [],
                    likes: [],
                },
                data: {
                    dayResult: dayResult,
                },
                active: true,
            };

            return dayResultTimelinePost;
        });
        timelinePosts = timelinePosts.concat(dayResultTimelinePosts);

        if (paginatedGoalResults?.results) {
            timelinePosts = timelinePosts.concat(paginatedGoalResults.results);
        }

        const handleSort = (postA: TimelinePostModel, postB: TimelinePostModel): number => {
            let postADate = postA.added.toDate();
            if (postA.type === 'DAILY_RESULT') {
                const dayResult = postA as DayResultTimelinePost;
                postADate = dayResult.data.dayResult.plannedDay!.date!;
            } else {
                postADate = postA.added.toDate();
            }

            let postBDate = postB.added.toDate();
            if (postB.type === 'DAILY_RESULT') {
                const dayResult = postB as DayResultTimelinePost;
                postBDate = dayResult.data.dayResult.plannedDay!.date!;
            } else {
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

    const getUserPosts = async () => {
        const userPosts = await StoryController.getAllViaApi();
        setUserPosts(userPosts);
    };

    const getPlannedDayResults = async () => {
        const dayResults = await DailyResultController.getAllViaApi();
        setDayResults(dayResults);
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
        if (newPaginatedGoalResults.results.length > 0) {
            currentGoalResults.results = currentGoalResults.results.concat(newPaginatedGoalResults.results);
            currentGoalResults.lastGoalResult = newPaginatedGoalResults.lastGoalResult;
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
