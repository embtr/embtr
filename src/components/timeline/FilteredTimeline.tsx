import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { TimelineElement, TimelineElementType } from 'resources/types/requests/Timeline';
import { UserPostTimelineElement } from 'src/components/timeline/UserPostTimelineElement';
import { PlannedDayResultTimelineElement } from './PlannedDayResultTimelineElement';
import { ChallengeRecentlyJoinedTimelineElement } from './ChallengeRecentlyJoinedTimelineElement';

const createFooter = (hasMore: boolean, colors: any) => {
    const footer = hasMore ? (
        <ActivityIndicator
            size="large"
            color={colors.secondary_text}
            style={{ marginVertical: 20 }}
        />
    ) : (
        <View
            style={{
                paddingTop: PADDING_LARGE,
                paddingBottom: PADDING_LARGE * 2.5,
            }}
        >
            <Text
                style={{
                    fontFamily: POPPINS_REGULAR,
                    color: colors.secondary_text,
                    textAlign: 'center',
                }}
            >
                welp... you've hit the bottom.
            </Text>
        </View>
    );

    return footer;
};

const renderItem = (item: TimelineElement, index: number) => {
    const isTop = index === 0;

    if (item.type === TimelineElementType.USER_POST && item.userPost) {
        return (
            <View
                style={{
                    paddingTop: isTop ? 0 : PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                }}
            >
                <UserPostTimelineElement userPost={item.userPost} />
            </View>
        );
    } else if (item.type === TimelineElementType.PLANNED_DAY_RESULT && item.plannedDayResult) {
        return (
            <View
                style={{
                    paddingTop: isTop ? 0 : PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                }}
            >
                <PlannedDayResultTimelineElement plannedDayResult={item.plannedDayResult} />
            </View>
        );
    } else if (item.type === TimelineElementType.RECENTLY_JOINED_CHALLENGE && item.challengeRecentlyJoined) {
        return (
            <View
                style={{
                    paddingTop: isTop ? 0 : PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                }}
            >
                <ChallengeRecentlyJoinedTimelineElement challengeRecentlyJoined={item.challengeRecentlyJoined} />
            </View>
        );
    }

    return <View />;
};

interface Props {
    timelineElements: TimelineElement[];
    hasMore: boolean;
    pullToRefresh: Function;
    loadMore: Function;
}

export const FilteredTimeline = ({ timelineElements, hasMore, pullToRefresh, loadMore }: Props) => {
    const { colors } = useTheme();

    const keyExtractor = (item: TimelineElement) => {
        const key = `${item.type}_post_${item.userPost?.id}_result_${item.plannedDayResult?.id}_challenge_${item.challengeRecentlyJoined?.id}_${item.challengeRecentlyJoined?.latestParticipant.id}`;
        return key;
    };

    return (
        <FlatList
            overScrollMode="always"
            data={timelineElements}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyboardShouldPersistTaps={'handled'}
            style={{ backgroundColor: colors.background }}
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                        pullToRefresh();
                    }}
                />
            }
            onEndReachedThreshold={1}
            onEndReached={() => {
                loadMore();
            }}
            ListFooterComponent={createFooter(hasMore, colors)}
        />
    );
};
