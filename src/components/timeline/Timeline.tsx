import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { JoinedChallenge, UserPost } from 'resources/schema';
import { FilteredTimeline } from './FilteredTimeline';
import StoryController from 'src/controller/timeline/story/StoryController';
import { getTimelineDays } from 'src/redux/user/GlobalState';
import { useAppSelector } from 'src/redux/Hooks';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import {
    NotificationController,
    NotificationCustomHooks,
} from 'src/controller/notification/NotificationController';
import { Button, View, Text } from 'react-native';
import { TimelineRequestCursor } from 'resources/types/requests/Timeline';

export const Timeline = () => {
    const [cursor, setCursor] = React.useState<TimelineRequestCursor>({
        cursor: new Date(),
        limit: 15,
    });
    const fetchData = async () => {
        const result = await DailyResultController.fetch(cursor);
        setCursor(result?.nextCursor ?? cursor);
        console.log('fetching data');
    };

    return (
        <View>
            <Button onPress={fetchData} title="Fetch Data" />
            <Text style={{ color: 'white', textAlign: 'center', paddingTop: 50 }}>
                {cursor.cursor.toString()}
            </Text>
        </View>
    );
};
