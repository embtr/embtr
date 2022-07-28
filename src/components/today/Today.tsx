import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getDayFromDayKey, getDayKey, getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/today/PlannedTask';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import { Banner } from 'src/components/common/Banner';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { TodayPicker } from 'src/components/today/TodayPicker';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getSelectedDayKey, setSelectedDayKey } from 'src/redux/user/GlobalState';
import { getAuth } from 'firebase/auth';
import { UserProfile } from 'src/components/profile/UserProfile';
import { UserType } from 'src/controller/profile/ProfileController';

export const Today = () => {
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();

    const dispatch = useAppDispatch();
    let dayKey = useAppSelector(getSelectedDayKey);
    if (!dayKey) {
        dayKey = getTodayKey();
    }

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getAuth().currentUser?.uid!, dayKey, setPlannedToday);
        }, [dayKey])
    );

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        dispatch(setSelectedDayKey(newDayKey));
        PlannedDayController.get(getAuth().currentUser?.uid!, newDayKey, setPlannedToday);
    };

    const updateTask = (updatedPlannedTask: PlannedTaskModel) => {
        PlannedDayController.updateTask(plannedToday!, updatedPlannedTask, () => {
            if (plannedToday?.id) {
                PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday?.id, setPlannedToday);
            }
        });
    };

    let taskViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        taskViews.push(
            <PlannedTask key={plannedTask.id} plannedTask={plannedTask} />
        );
    });

    return (
        <Screen>
            <EmbtrMenuCustom />

            <View style={{ flex: 1 }}>
                <Banner name={"Today"} leftIcon={"add"} leftOnClick={() => { navigation.navigate('CreateOneTimeTask', { dayKey: plannedToday?.id! }) }} />
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <TodayPicker day={getDayFromDayKey(getTodayKey())} onDayChanged={onDayChanged} />
                </View>
                <CalendarView plannedToday={plannedToday} updateTask={updateTask} userType={UserType.USER} />
            </View>

        </Screen>
    );
};