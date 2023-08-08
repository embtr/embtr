import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { FilteredTimeline } from 'src/components/timeline/FilteredTimeline';

export const DailyResults = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPosts'>>();
    const userId = route.params.userId;

    const [plannedDayResultSummaries, setPlannedDayResultSummaries] = React.useState<
        PlannedDayResultSummary[]
    >([]);

    useFocusEffect(
        React.useCallback(() => {
            getPlannedDayResults();
        }, [])
    );

    const getPlannedDayResults = async () => {
        const plannedDayResultSummaries =
            (await DailyResultController.getAllSummariesForUser(userId)) ?? [];
        setPlannedDayResultSummaries(plannedDayResultSummaries);
    };

    return (
        <Screen>
            <Banner name="Daily Results" leftText="back" leftRoute="BACK" />
            <FilteredTimeline
                userPosts={[]}
                plannedDayResultSummaries={plannedDayResultSummaries}
                joinedChallenges={[]}
                refreshing={false}
                loadMore={() => {}}
            />
        </Screen>
    );
};
