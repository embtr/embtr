import * as React from 'react';
import { View } from 'react-native';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TimelineController, { PaginatedTimelinePosts, TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { CARD_SHADOW } from 'src/util/constants';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import DailyResultController, { DailyResultModel, PaginatedDailyResults } from 'src/controller/timeline/daily_result/DailyResultController';
import { wait } from 'src/util/GeneralUtility';
import { getDateMinusDays, getDaysOld } from 'src/util/DateUtility';
import { getDateFromDayKey } from 'src/controller/planning/PlannedDayController';
import { GoalResultModel, PaginatedGoalResults } from 'src/controller/timeline/goals/GoalResultController';

interface Props {
    refreshedTimestamp: Date;
}

const getDefaultCutoffDate = () => {
    const date = getDateMinusDays(new Date(), 3);
    return date;
};

export const ActivityTabRoute = ({ refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const card = {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    };

    const [paginatedTimelinePosts, setPaginatedTimelinePosts] = React.useState<PaginatedTimelinePosts>();
    const [paginatedDailyResults, setPaginatedDailyResults] = React.useState<PaginatedDailyResults>();
    const [paginatedGoalResults, setPaginatedGoalResults] = React.useState<PaginatedGoalResults>();
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoadingMode, setIsLoadingMode] = React.useState(false);
    const [timelinePostCutoffDate, setTimelinePostCutoffDate] = React.useState<Date>(getDefaultCutoffDate());
    const [dailyRestultCutoffDate, setDailyResultCutoffDate] = React.useState<Date>(getDefaultCutoffDate());
    const [goalResultCutoffDate, setGoalResultCutoffDate] = React.useState<Date>(getDefaultCutoffDate());

    React.useEffect(() => {
        onRefresh();
    }, [refreshedTimestamp]);

    React.useEffect(() => {
        fetchPaginatedTimelinePostsForUser();
    }, [timelinePostCutoffDate]);

    React.useEffect(() => {
        fetchPaginatedDailyResultsForUser();
    }, [dailyRestultCutoffDate]);

    React.useEffect(() => {
        fetchPaginatedGoalResultsForUser();
    }, [goalResultCutoffDate]);

    React.useEffect(() => {
        updateTimelineViews();
    }, [paginatedTimelinePosts, paginatedDailyResults]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        setTimelinePostCutoffDate(new Date());
        setTimelinePostCutoffDate(getDefaultCutoffDate());

        setDailyResultCutoffDate(new Date());
        setDailyResultCutoffDate(getDefaultCutoffDate());

        setGoalResultCutoffDate(new Date());
        setGoalResultCutoffDate(getDefaultCutoffDate());

        wait(500).then(() => setRefreshing(false));
    }, []);

    const fetchPaginatedTimelinePostsForUser = () => {};

    const fetchPaginatedDailyResultsForUser = async () => {};

    const fetchPaginatedGoalResultsForUser = async () => {};

    const createStoryView = (timelineEntry: TimelinePostModel) => {
        return (
            <View key={timelineEntry.id} style={[card, CARD_SHADOW]}>
                <UserTextCard oldModel={timelineEntry as StoryModel} />
            </View>
        );
    };

    const createDailyResultView = (timelineEntry: TimelinePostModel) => {
        return <View key={timelineEntry.id} style={[card, CARD_SHADOW]}></View>;
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case 'STORY':
                return createStoryView(timelineEntry);

            case 'DAILY_RESULT':
                return createDailyResultView(timelineEntry);

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
            } else if (postA.type === 'GOAL_RESULT') {
                const goalResult = postA as GoalResultModel;
                postADate = goalResult.data.completionDate.toDate();
            }

            let postBDate = postB.added.toDate();
            if (postB.type === 'DAILY_RESULT') {
                const dailyResult = postB as DailyResultModel;
                postBDate = getDateFromDayKey(dailyResult.data.dayKey);
            } else if (postB.type === 'GOAL_RESULT') {
                const goalResult = postB as GoalResultModel;
                postBDate = goalResult.data.completionDate.toDate();
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

    const addPageOfTimelinePosts = () => {
        const nextCutoffDate = getDateMinusDays(timelinePostCutoffDate, 1);
        setTimelinePostCutoffDate(nextCutoffDate);

        TimelineController.getPaginatedTimelinePosts(
            paginatedTimelinePosts?.lastTimelinePost,
            nextCutoffDate,
            (newPaginatedTimelinePosts: PaginatedTimelinePosts) => {
                let currentTimelinePosts: PaginatedTimelinePosts = {
                    posts: [],
                    lastTimelinePost: paginatedTimelinePosts?.lastTimelinePost,
                };

                if (paginatedTimelinePosts?.posts) {
                    currentTimelinePosts.posts = [...paginatedTimelinePosts.posts];
                }

                if (newPaginatedTimelinePosts.posts.length > 0) {
                    currentTimelinePosts.posts = currentTimelinePosts.posts.concat(newPaginatedTimelinePosts.posts);
                    currentTimelinePosts.lastTimelinePost = newPaginatedTimelinePosts.lastTimelinePost;
                }

                setPaginatedTimelinePosts(currentTimelinePosts);
            }
        );
    };

    const addPageOfDailyResults = async () => {
        const nextCutOffDate = getDateMinusDays(dailyRestultCutoffDate, 1);
        setDailyResultCutoffDate(nextCutOffDate);

        let currentDailyResults: PaginatedDailyResults = {
            results: [],
            lastDailyResult: paginatedDailyResults?.lastDailyResult,
        };

        if (paginatedDailyResults?.results) {
            currentDailyResults.results = [...paginatedDailyResults.results];
        }

        const newPaginatedDailyResults = await DailyResultController.getPaginatedFinished(paginatedDailyResults?.lastDailyResult, dailyRestultCutoffDate);
        if (newPaginatedDailyResults.results.length > 0) {
            currentDailyResults.results = currentDailyResults.results.concat(newPaginatedDailyResults.results);
            currentDailyResults.lastDailyResult = newPaginatedDailyResults.lastDailyResult;
        }

        setPaginatedDailyResults(currentDailyResults);
    };

    const loadMore = () => {
        if (isLoadingMode) {
            return;
        }

        setIsLoadingMode(true);
        addPageOfTimelinePosts();
        addPageOfDailyResults();
        wait(500).then(() => setIsLoadingMode(false));
    };

    return <View style={{ flex: 1 }}>{timelineViews}</View>;
};
