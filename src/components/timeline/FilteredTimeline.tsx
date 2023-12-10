import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { JoinedChallenge, UserPost } from 'resources/schema';
import { TimelinePostModel } from 'src/model/OldModels';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { TimelineType } from 'resources/types/Types';
import { TimelineCard } from './TimelineCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { PostUtility } from 'src/util/post/PostUtility';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

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
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const { colors } = useTheme();

    const getRecentlyJoinedMessage = (joinedChallenge: JoinedChallenge) => {
        const participants = joinedChallenge.participants;
        if (participants.length === 1) {
            return 'recently joined';
        }

        if (participants.length === 2) {
            return '+ ' + (participants.length - 1) + ' other recently joined';
        }

        return '+ ' + (participants.length - 1) + ' others recently joined';
    };

    const createTimelineModels = (): TimelinePostModel[] => {
        const userPostTimelinePosts: TimelinePostModel[] = userPosts.map((userPost) => {
            return PostUtility.createUserPostTimelineModel(userPost);
        });

        const dayResultTimelinePosts: TimelinePostModel[] = plannedDayResultSummaries.map(
            (plannedDayResultSummary) => {
                return PostUtility.createDayResultTimelineModel(
                    plannedDayResultSummary.plannedDayResult
                );
            }
        );

        const joinedChallengesTimelinePosts = joinedChallenges.map((joinedChallenge) => ({
            user: joinedChallenge.participants?.[0]?.user!,
            secondaryHeaderText: getRecentlyJoinedMessage(joinedChallenge),
            title: joinedChallenge.challenge.name,
            body: joinedChallenge.challenge.description ?? '',
            type: TimelineType.JOINED_CHALLENGE,
            id: joinedChallenge.challenge.id!,
            sortDate: joinedChallenge.participants?.[0]?.createdAt!,
            comments: joinedChallenge.challenge.comments ?? [],
            likes: joinedChallenge.challenge.likes ?? [],
            images: joinedChallenge.challenge.images ?? [],
            joinedChallenge,

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
            <View
                key={key}
                style={{
                    width: '100%',
                    paddingTop: TIMELINE_CARD_PADDING,
                    paddingHorizontal: TIMELINE_CARD_PADDING,
                }}
            >
                <TimelineCard
                    timelinePostModel={timelinePostModel}
                    navigateToDetails={() => {
                        if (timelinePostModel.type === TimelineType.USER_POST) {
                            navigation.navigate('UserPostDetails', { id: timelinePostModel.id });
                        } else if (timelinePostModel.type === TimelineType.JOINED_CHALLENGE) {
                            navigation.navigate('ChallengeDetails', { id: timelinePostModel.id });
                        } else if (timelinePostModel.type === TimelineType.PLANNED_DAY_RESULT) {
                            navigation.navigate('DailyResultDetails', { id: timelinePostModel.id });
                        }
                    }}
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
