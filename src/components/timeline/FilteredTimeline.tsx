import { NativeScrollEvent, RefreshControl, ScrollView, Text, View } from 'react-native';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';
import { PlannedDayResult as PlannedDayResultModel, UserPost } from 'resources/schema';
import { Timestamp } from 'firebase/firestore';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { TimelinePostModel } from 'src/model/OldModels';

interface Props {
    userPosts: UserPost[];
    dayResults: PlannedDayResultModel[];
    refreshing: boolean;
    onRefresh: Function;
}

export const FilteredTimeline = ({ userPosts, dayResults, refreshing, onRefresh }: Props) => {
    const { colors } = useTheme();
    const card = {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    };

    const createTimelineModels = (): TimelinePostModel[] => {
        let timelinePosts: TimelinePostModel[] = [];

        if (userPosts.length > 0) {
            const userPostTimelinePosts: TimelinePostModel[] = userPosts.map(
                (userPost: UserPost) => {
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
                }
            );

            timelinePosts = timelinePosts.concat(userPostTimelinePosts);
        }

        if (dayResults.length > 0) {
            const dayResultTimelinePosts: DayResultTimelinePost[] = dayResults.map(
                (dayResult: PlannedDayResultModel) => {
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
                }
            );

            timelinePosts = timelinePosts.concat(dayResultTimelinePosts);

            return timelinePosts;
        }

        return timelinePosts;
    };

    const createTimelineViews = () => {
        let timelinePosts: TimelinePostModel[] = createTimelineModels();

        const handleSort = (postA: TimelinePostModel, postB: TimelinePostModel): number => {
            let postADate = postA.added.toDate();
            let postBDate = postB.added.toDate();

            return postBDate.getTime() - postADate.getTime();
        };

        timelinePosts.sort((a, b) => handleSort(a, b));

        let views: JSX.Element[] = [];
        timelinePosts.forEach((timelineEntry) => {
            const view: JSX.Element = createTimelineView(timelineEntry);
            views.push(view);
        });

        return views;
    };

    const createUserPostView = (timelineEntry: TimelinePostModel) => {
        const model = timelineEntry as StoryModel;

        const key = ModelKeyGenerator.generateUserPostKey(model.data.userPost);

        return (
            <View key={key} style={[card]}>
                <UserTextCard oldModel={model} />
            </View>
        );
    };

    const createDailyResultView = (timelineEntry: TimelinePostModel) => {
        const model = timelineEntry as DayResultTimelinePost;

        const key = ModelKeyGenerator.generatePlannedDayResultKey(model.data.dayResult);
        return (
            <View key={key} style={[card]}>
                <DailyResultCard plannedDayResult={model} />
            </View>
        );
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case 'STORY':
                return createUserPostView(timelineEntry);

            case 'DAILY_RESULT':
                return createDailyResultView(timelineEntry);

            default:
                return <View />;
        }
    };

    const isCloseToBottom = ({
        layoutMeasurement,
        contentOffset,
        contentSize,
    }: NativeScrollEvent) => {
        return layoutMeasurement.height + contentOffset.y > contentSize.height - 15;
    };

    const timelineViews = createTimelineViews();

    return (
        <ScrollView
            overScrollMode="always"
            onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                }
            }}
            scrollEventThrottle={8}
            keyboardShouldPersistTaps={'handled'}
            style={{ backgroundColor: colors.background }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        onRefresh();
                    }}
                />
            }
        >
            {timelineViews.length > 0 && <View style={{ flex: 1 }}>{timelineViews}</View>}
            {timelineViews.length == 0 && (
                <View style={{ flex: 1, paddingTop: 50, paddingBottom: 50, alignItems: 'center' }}>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR }}>
                        looks like there's nothing to show.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};
