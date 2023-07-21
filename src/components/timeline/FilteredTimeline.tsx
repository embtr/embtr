import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultCard } from 'src/components/common/timeline/DailyResultCard';
import {
    JoinedChallenge,
    PlannedDayResult as PlannedDayResultModel,
    UserPost,
} from 'resources/schema';
import { Timestamp } from 'firebase/firestore';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { TimelinePostModel } from 'src/model/OldModels';
import { JoinedChallengeTimelinePost } from 'src/controller/challenge/ChallengeController';
import { JoinedChallengeCard } from '../common/timeline/challenges/JoinedChallengeCard';

interface Props {
    userPosts: UserPost[];
    dayResults: PlannedDayResultModel[];
    joinedChallenges: JoinedChallenge[];
    refreshing: boolean;
    loadMore: Function;
}

export const FilteredTimeline = ({
    userPosts,
    dayResults,
    joinedChallenges,
    refreshing,
    loadMore,
}: Props) => {
    const { colors } = useTheme();
    const card = {
        width: '100%',
        paddingTop: 7.5,
        paddingLeft: 5,
        paddingRight: 5,
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

        const dayResultTimelinePosts = dayResults.map((dayResult) => ({
            added: Timestamp.fromDate(dayResult.createdAt!),
            modified: Timestamp.fromDate(dayResult.updatedAt!),
            type: 'DAILY_RESULT',
            uid: dayResult.plannedDay!.user!.uid!,
            public: {
                comments: [],
                likes: [],
            },
            data: {
                dayResult,
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

        const key = ModelKeyGenerator.generatePlannedDayResultKey(model.data.dayResult);
        return (
            <View key={key} style={[card]}>
                <DailyResultCard plannedDayResult={model} />
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
