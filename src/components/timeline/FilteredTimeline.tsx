import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { JoinedChallenge, UserPost } from 'resources/schema';
import { Timestamp } from 'firebase/firestore';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { TimelinePostModel } from 'src/model/OldModels';
import { JoinedChallengeTimelinePost } from 'src/controller/challenge/ChallengeController';
import { JoinedChallengeCard } from '../common/timeline/challenges/JoinedChallengeCard';
import { PlannedDayResultCard } from '../common/timeline/planned_day_result/PlannedDayResultCard';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';

interface Props {
    userPosts: UserPost[];
    plannedDayResultSummaries: PlannedDayResultSummary[];
    joinedChallenges: JoinedChallenge[];
    refreshing: boolean;
    loadMore: Function;
}

export const FilteredTimeline = ({
    userPosts,
    plannedDayResultSummaries,
    joinedChallenges,
    refreshing,
    loadMore,
}: Props) => {
    const { colors } = useTheme();
    const card = {
        width: '100%',
        paddingTop: 12,
        paddingHorizontal: 12,
    };

    const createTimelineModels = (): TimelinePostModel[] => {
        const userPostTimelinePosts = userPosts.map((userPost) => ({
            added: Timestamp.fromDate(userPost.createdAt!),
            modified: Timestamp.fromDate(userPost.updatedAt!),
            type: 'STORY',
            uid: userPost.user!.uid!,
            public: {
                comments: [],
                likes: [],
            },
            data: {
                userPost,
            },
            active: true,
        }));

        const dayResultTimelinePosts = plannedDayResultSummaries.map((plannedDayResultSummary) => ({
            added: Timestamp.fromDate(plannedDayResultSummary.plannedDayResult.createdAt!),
            modified: Timestamp.fromDate(plannedDayResultSummary.plannedDayResult.updatedAt!),
            type: 'DAILY_RESULT',
            uid: plannedDayResultSummary.plannedDayResult.plannedDay!.user!.uid!,
            public: {
                comments: [],
                likes: [],
            },
            data: {
                plannedDayResultSummary,
            },
            active: true,
        }));

        const joinedChallengesTimelinePosts = joinedChallenges.map((joinedChallenge) => ({
            added: Timestamp.fromDate(joinedChallenge.participants?.[0]?.createdAt!),
            modified: Timestamp.fromDate(joinedChallenge.participants?.[0].updatedAt!),
            type: 'JOINED_CHALLENGE',
            public: {
                comments: [],
                likes: [],
            },
            uid: '',
            data: {
                joinedChallenge,
            },
            active: true,
        }));

        return [
            ...userPostTimelinePosts,
            ...dayResultTimelinePosts,
            ...joinedChallengesTimelinePosts,
        ];
    };

    const createTimelineViews = () => {
        let timelinePosts: TimelinePostModel[] = createTimelineModels();
        const handleSort = (postA: TimelinePostModel, postB: TimelinePostModel): number => {
            let postADate = postA.added.toDate();
            let postBDate = postB.added.toDate();

            return postBDate.getTime() - postADate.getTime();
        };

        timelinePosts.sort((a, b) => handleSort(a, b));

        return timelinePosts;
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

        return (
            <View key={model.data.plannedDayResultSummary.plannedDayResult.id} style={[card]}>
                <PlannedDayResultCard plannedDayResult={model} />
            </View>
        );
    };

    const createJoinedChallengeView = (timelineEntry: TimelinePostModel) => {
        const model = timelineEntry as JoinedChallengeTimelinePost;

        const key = model.data.joinedChallenge.challenge.id;
        return (
            <View key={key} style={[card]}>
                <JoinedChallengeCard joinedChallenge={model.data.joinedChallenge} />
            </View>
        );
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case 'STORY':
                return createUserPostView(timelineEntry);

            case 'DAILY_RESULT':
                return createDailyResultView(timelineEntry);

            case 'JOINED_CHALLENGE':
                return createJoinedChallengeView(timelineEntry);

            default:
                return <View />;
        }
    };

    const data = createTimelineViews();

    return (
        <FlatList
            overScrollMode="always"
            data={data}
            keyExtractor={(item, index) => `timeline_${index}`}
            renderItem={({ item }) => createTimelineView(item)}
            keyboardShouldPersistTaps={'handled'}
            style={{ backgroundColor: colors.background }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                        loadMore(true);
                    }}
                />
            }
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                loadMore(false);
            }}
            ListFooterComponent={
                <ActivityIndicator
                    size="large"
                    color={colors.secondary_text}
                    style={{ marginVertical: 20 }}
                />
            }
        />
    );
};
