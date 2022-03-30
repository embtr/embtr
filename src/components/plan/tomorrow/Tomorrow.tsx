import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { getTomorrow, RoutineModel } from 'src/controller/planning/RoutineController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Plan } from 'src/components/plan/Plan';
import { Countdown } from 'src/components/common/time/Countdown';
import PlannedDayController, { PlannedDay, PlannedTask } from 'src/controller/planning/PlannedDayController';
import { DateUtil } from 'src/util/DateUtil';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);
    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<boolean>(false);
    const [checkedTasks, setCheckedTasks] = React.useState(new Map<string, boolean>());

    const tomorrow = getTomorrow();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutinesForDay(getAuth().currentUser!.uid, tomorrow, setRoutines);
        }, [])
    );

    const onChecked = (taskId: string, checked: boolean) => {
        let newCheckedTasks: Map<string, boolean> = new Map(checkedTasks);
        newCheckedTasks.set(taskId, checked);
        setCheckedTasks(newCheckedTasks);
    };

    useFocusEffect(
        React.useCallback(() => {
            let routineViews: JSX.Element[] = [];
            routines.forEach(routine => {
                if (locked) {
                    if (checkedTasks.get(routine.id!) !== false) {
                        routineViews.push(<View key={routine.id} style={{ paddingBottom: 5 }}><Plan routine={routine} /></View>);
                    }
                } else {
                    routineViews.push(<View key={routine.id} style={{ paddingBottom: 5 }}><PlanningTask routine={routine} isChecked={checkedTasks.get(routine.id!) !== false} onCheckboxToggled={onChecked} /></View>);
                }
            });

            setTaskViews(routineViews);
        }, [locked, routines, checkedTasks])
    );

    const getPlannedDay = (): PlannedDay => {
        let plannedtasks: PlannedTask[] = [];
        routines.forEach(routine => {
            if (checkedTasks.get(routine.id!) !== false) {
                const plannedTask: PlannedTask = {
                    routineUid: routine.id!
                }

                plannedtasks.push(plannedTask);
            }
        });

        const plannedDay: PlannedDay = {
            plannedTasks: plannedtasks,
            id: DateUtil.getTomorrowKey()
        };

        return plannedDay;
    };

    const toggleLock = () => {
        const lockPlans = !locked;
        DateUtil.getTomorrowKey();

        if (lockPlans) {
            PlannedDayController.delete(DateUtil.getTomorrowKey(), () => {
                const plannedDay: PlannedDay = getPlannedDay();
                PlannedDayController.create(plannedDay);
            });
        }

        setLocked(lockPlans);
    };

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, textAlign: "center", fontSize: 17, paddingTop: 10 }}>
                    Tomorrow is
                    <Text style={{ color: colors.primary_border }}> {tomorrowCapitalized}</Text>
                </Text>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 10, paddingTop: 2 }}>
                        Starts in <Countdown />
                    </Text>
                </View>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 11, paddingTop: 4 }}>
                        <Text style={{ color: locked ? "green" : "red" }} >{locked ? "locked 🔒" : "unlocked 🔓"} </Text>
                    </Text>
                </View>
            </View>

            <View style={{ flex: 8 }}>
                <Text style={{ color: colors.text, textAlign: "center", paddingTop: "1%" }}>
                    Plan Your Day
                </Text>
                <Text style={{ color: colors.text, textAlign: "center", paddingBottom: "2%", fontSize: 12, paddingLeft: "5%", paddingRight: "5%" }}>
                    {locked ? "You can unlock tomorrows schedule if you need to make changes." : "Select the tasks that you intend on completing tomorrow. You can update the start time and duration. Lock in your plans once you feel confident about tomorrows schedule!"}
                </Text>
                <ScrollView style={{ backgroundColor: colors.background_secondary, paddingTop: 5, height: "97%" }}>
                    {taskViews}
                </ScrollView>
            </View>

            <View style={{ flex: 1.5, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <EmbtrButton buttonText={locked ? 'Unlock Plans 🔓' : 'Lock Plans 🔒'} callback={() => { toggleLock() }} />
            </View>
        </View>
    );
};