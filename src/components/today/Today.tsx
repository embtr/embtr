import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { createPlannedTask, getDayFromDayKey, getDayKey, getTodayKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/today/PlannedTask';
import { CalendarView } from 'src/components/today/views/calendar/CalendarView';
import { Banner } from 'src/components/common/Banner';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { TodayPicker } from 'src/components/today/TodayPicker';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu, getSelectedDayKey, setMenuOptions, setSelectedDayKey } from 'src/redux/user/GlobalState';
import { getAuth } from 'firebase/auth';
import { UserType } from 'src/controller/profile/ProfileController';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { AddHabitModal } from 'src/components/today/AddHabitModal';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';

export const Today = () => {
    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();
    const [addHabitModalVisible, setAddHabitModalVisible] = React.useState<boolean>(false);
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const openAddMenu = useAppSelector(getOpenMenu);
    const closeAddMenu = useAppSelector(getCloseMenu);

    const openAddHabitModal = () => { setAddHabitModalVisible(true) };
    const closeAddHabitModal = () => { setAddHabitModalVisible(false) };

    const dispatch = useAppDispatch();

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getAuth().currentUser?.uid!, selectedDayKey, setPlannedToday);
        }, [selectedDayKey])
    );

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
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

    const updateMenuOptions = () => {
        let menuOptions: EmbtrMenuOption[] = [];
        menuOptions.push({ name: "Create Task", onPress: () => { closeAddMenu(); navigation.navigate('CreateOneTimeTask', { dayKey: plannedToday?.id! }) } });
        menuOptions.push({ name: "Add Habit", onPress: () => { closeAddMenu(); openAddHabitModal(); } });
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const addHabitFromModal = (habitToAdd: TaskModel | undefined) => {
        if (!habitToAdd || !plannedToday?.id) {
            return;
        }

        const plannedTask: PlannedTaskModel = createPlannedTask(habitToAdd, 360, 30);
        PlannedDayController.addTask(plannedToday, plannedTask, () => {
            PlannedDayController.get(getAuth().currentUser?.uid!, plannedToday!.id!, setPlannedToday);
            closeAddHabitModal();
        });
    };

    return (
        <Screen>
            <EmbtrMenuCustom />
            <AddHabitModal visible={addHabitModalVisible} confirm={addHabitFromModal} dismiss={closeAddHabitModal} />

            <View style={{ flex: 1 }}>
                <Banner name={"Today"} leftIcon={"add"} leftOnClick={() => { updateMenuOptions(); openAddMenu() }} />
                <View style={{ paddingTop: 20, paddingBottom: 25 }}>
                    <TodayPicker day={getDayFromDayKey(selectedDayKey)} onDayChanged={onDayChanged} />
                </View>
                <CalendarView plannedToday={plannedToday} updateTask={updateTask} userType={UserType.USER} />
            </View>

        </Screen>
    );
};