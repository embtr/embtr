import * as React from 'react';
import { View } from 'react-native';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { useFocusEffect } from '@react-navigation/native';
import { UserType } from 'src/controller/profile/ProfileController';
import { getAuth } from 'firebase/auth';

interface Props {
    userProfileModel: UserProfileModel;
}

export const TodayTabRoute = ({ userProfileModel }: Props) => {
    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();

    useFocusEffect(
        React.useCallback(() => {
            if (userProfileModel?.uid) {
                PlannedDayController.get(userProfileModel.uid, getTodayKey(), setPlannedToday);
            }
        }, [])
    );

    const userType: UserType = userProfileModel.uid === getAuth().currentUser!.uid ? UserType.USER : UserType.GUEST;
    return (
        <View>
            <CalendarView plannedToday={plannedToday} onPlanTodayUpdated={setPlannedToday} userType={userType} />
        </View>
    );
};
