import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TimelinePostModel } from 'src/model/OldModels';
import { TimelineCard } from './TimelineCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { PostUtility } from 'src/util/post/PostUtility';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { TimelineElement, TimelineElementType } from 'resources/types/requests/Timeline';

const createTimelineModels = (timelineElements: TimelineElement[]): TimelinePostModel[] => {
    const models: TimelinePostModel[] = [];

    timelineElements.forEach((timelineElement) => {
        if (timelineElement.type == TimelineElementType.USER_POST && timelineElement.userPost) {
            models.push(PostUtility.createUserPostTimelineModel(timelineElement.userPost));
        } else if (
            timelineElement.type == TimelineElementType.PLANNED_DAY_RESULT &&
            timelineElement.plannedDayResult
        ) {
            models.push(PostUtility.createDayResultTimelineModel(timelineElement.plannedDayResult));
        }
    });

    return models;
};

const createTimelineView = (timelinePostModel: TimelinePostModel) => {
    const key = timelinePostModel.id;
    return (
        <View
            style={{
                width: '100%',
                paddingTop: TIMELINE_CARD_PADDING,
                paddingHorizontal: TIMELINE_CARD_PADDING,
            }}
        >
            <TimelineCard timelinePostModel={timelinePostModel} navigateToDetails={() => {}} />
        </View>
    );
};

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

interface Props {
    timelineElements: TimelineElement[];
    hasMore: boolean;
    pullToRefresh: Function;
    loadMore: Function;
}

export const FilteredTimeline = ({ timelineElements, hasMore, pullToRefresh, loadMore }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const data = createTimelineModels(timelineElements);

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
                    refreshing={false}
                    onRefresh={() => {
                        pullToRefresh();
                    }}
                />
            }
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                loadMore();
            }}
            ListFooterComponent={createFooter(hasMore, colors)}
        />
    );
};
