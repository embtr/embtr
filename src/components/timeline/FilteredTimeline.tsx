import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { TimelineElement, TimelineElementType } from 'resources/types/requests/Timeline';
import { UserPostTimelineElement } from 'src/components/timeline/UserPostTimelineElement';
import { PlannedDayResultTimelineElement } from './PlannedDayResultTimelineElement';

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
                paddingTop: TIMELINE_CARD_PADDING,
                paddingBottom: TIMELINE_CARD_PADDING * 2.5,
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

const renderItem = (item: TimelineElement) => {
    if (item.type === TimelineElementType.USER_POST && item.userPost) {
        return <UserPostTimelineElement initialUserPost={item.userPost} />;
    } else if (item.type === TimelineElementType.PLANNED_DAY_RESULT && item.plannedDayResult) {
        return <PlannedDayResultTimelineElement initialPlannedDayResult={item.plannedDayResult} />;
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
        const key = `${item.type}_post_${item.userPost?.id}_result_${item.plannedDayResult?.id}`;
        return key;
    };

    return (
        <FlatList
            overScrollMode="always"
            data={timelineElements}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => renderItem(item)}
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
