import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { JoinedChallenge, UserPost } from 'resources/schema';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { TimelinePostModel } from 'src/model/OldModels';
import { JoinedChallengeTimelinePost } from 'src/controller/challenge/ChallengeController';
import { JoinedChallengeCard } from '../common/timeline/challenges/JoinedChallengeCard';
import { PlannedDayResultCard } from '../common/timeline/planned_day_result/PlannedDayResultCard';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { TimelineType } from 'resources/types/Types';
import { TimelineCard } from './TimelineCard';
import { getDayOfTheWeekFromDate } from 'src/controller/planning/PlannedDayController';

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
        const userPostTimelinePosts: TimelinePostModel[] = userPosts.map((userPost) => ({
            user: userPost.user!,
            type: TimelineType.USER_POST,
            id: userPost.id!,
            sortDate: userPost.createdAt!,
            comments: userPost.comments ?? [],
            likes: userPost.likes ?? [],
            images: userPost.images ?? [],
            title: userPost.title ?? '',
            body: userPost.body ?? '',
            data: {
                userPost,
            },
        }));

        const dayResultTimelinePosts: TimelinePostModel[] = plannedDayResultSummaries.map(
            (plannedDayResultSummary) => ({
                title: plannedDayResultSummary.plannedDayResult.title,
                secondaryText:
                    getDayOfTheWeekFromDate(
                        plannedDayResultSummary.plannedDayResult.plannedDay?.date ?? new Date()
                    ) + ' Results',
                user: plannedDayResultSummary.plannedDayResult.plannedDay?.user!,
                type: TimelineType.PLANNED_DAY_RESULT,
                id: plannedDayResultSummary.plannedDayResult.plannedDay?.id!,
                sortDate: plannedDayResultSummary.plannedDayResult.createdAt!,
                comments: plannedDayResultSummary.plannedDayResult.comments ?? [],
                likes: plannedDayResultSummary.plannedDayResult.likes ?? [],
                images: plannedDayResultSummary.plannedDayResult.images ?? [],
                body: plannedDayResultSummary.plannedDayResult.description ?? '',
                completedHabits: plannedDayResultSummary.completedHabits,
                data: {
                    plannedDayResultSummary,
                },
            })
        );

        const joinedChallengesTimelinePosts = joinedChallenges.map((joinedChallenge) => ({
            user: joinedChallenge.participants?.[0]?.user!,
            type: TimelineType.JOINED_CHALLENGE,
            id: joinedChallenge.challenge.id!,
            sortDate: joinedChallenge.participants?.[0]?.createdAt!,
            comments: joinedChallenge.challenge.comments ?? [],
            likes: joinedChallenge.challenge.likes ?? [],
            images: joinedChallenge.challenge.images ?? [],
            data: {
                joinedChallenge,
            },
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
            let postADate = postA.sortDate;
            let postBDate = postB.sortDate;

            return postBDate.getTime() - postADate.getTime();
        };

        timelinePosts.sort((a, b) => handleSort(a, b));

        return timelinePosts;
    };

    const createTimelineView = (timelinePostModel: TimelinePostModel) => {
        const key = timelinePostModel.id;
        return (
            <View key={key} style={[card]}>
                <TimelineCard
                    timelinePostModel={timelinePostModel}
                    onLike={() => {}}
                    navigateToDetails={() => {}}
                />
            </View>
        );
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
