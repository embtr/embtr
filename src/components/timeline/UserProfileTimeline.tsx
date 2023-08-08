import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StoryModel } from 'src/controller/timeline/story/StoryController';
import { DayResultTimelinePost } from 'src/controller/timeline/daily_result/DailyResultController';
import { PlannedDayResult as PlannedDayResultModel, UserPost } from 'resources/schema';
import { Timestamp } from 'firebase/firestore';
import { ModelKeyGenerator } from 'src/util/model/ModelKeyGenerator';
import { TimelinePostModel } from 'src/model/OldModels';
import React from 'react';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';

interface Props {
    userPosts: UserPost[];
    plannedDayResultSummaries: PlannedDayResultSummary[];
    refreshing: boolean;
    loadMore: Function;
}

export const UserProfileTimeline = ({
    userPosts,
    plannedDayResultSummaries,
    refreshing,
    loadMore,
}: Props) => {
    const { colors } = useTheme();
    const card = {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    };

    return <View />;
};
