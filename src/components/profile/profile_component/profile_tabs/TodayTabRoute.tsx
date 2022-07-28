import * as React from 'react';
import { View, Text } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    userProfileModel: UserProfileModel
}

export const TodayTabRoute = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();
    useFocusEffect(
        React.useCallback(() => {
            if (userProfileModel?.uid) {
                PlannedDayController.get(userProfileModel.uid, getTodayKey(), setPlannedToday);
            }
        }, [])
    );


    return (
        <View>
            <CalendarView plannedToday={plannedToday} updateTask={() => {}} />
        </View>
    )
};