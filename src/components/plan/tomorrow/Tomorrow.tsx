import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { getTomorrowDayOfWeek, RoutineModel } from 'src/controller/planning/TaskController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Countdown } from 'src/components/common/time/Countdown';
import PlannedDayController, { getTomorrowKey, PlannedDay, PlannedTask } from 'src/controller/planning/PlannedDayController';
import { Plan } from 'src/components/plan/Plan';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<boolean>(false);
    const [checkedTasks, setCheckedTasks] = React.useState(new Map<string, boolean>());

    const tomorrow = getTomorrowDayOfWeek();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutinesForDay(getAuth().currentUser!.uid, tomorrow, setRoutines);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getTomorrowKey(), setPlannedDay);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (plannedDay?.metadata) {
                setLocked(plannedDay?.metadata?.locked);
            }
        }, [plannedDay])
    );

    useFocusEffect(
        React.useCallback(() => {
            let routineViews: JSX.Element[] = [];

            if (locked) {
                plannedDay?.plannedTasks.forEach(plannedTask => {
                    routineViews.push(<View key={plannedTask.routine.id} style={{ paddingBottom: 5 }}><Plan routine={plannedTask.routine} /></View>);
                });
            } else {
                routines.forEach(routine => {
                    routineViews.push(<View key={routine.id} style={{ paddingBottom: 5 }}><PlanningTask routine={routine} isChecked={checkedTasks.get(routine.id!) !== false} onCheckboxToggled={onChecked} /></View>);
                });
            }

            setTaskViews(routineViews);
        }, [locked, routines, plannedDay, checkedTasks])
    );

    const onChecked = (taskId: string, checked: boolean) => {
        let newCheckedTasks: Map<string, boolean> = new Map(checkedTasks);
        newCheckedTasks.set(taskId, checked);
        setCheckedTasks(newCheckedTasks);
    };

    /*
     * move me to the controller!
    */
    const getUpdatedPlannedDay = (): PlannedDay => {
        let plannedtasks: PlannedTask[] = [];
        routines.forEach(routine => {
            if (checkedTasks.get(routine.id!) !== false) {
                const plannedTask: PlannedTask = {
                    routine: routine
                }

                plannedtasks.push(plannedTask);
            }
        });

        const newPlannedDay: PlannedDay = {
            id: plannedDay?.id,
            metadata: plannedDay?.metadata,
            plannedTasks: plannedtasks
        };

        return newPlannedDay;
    };

    const isNewPlannedDay = (): boolean => {
        return plannedDay?.metadata === undefined;
    };

    const createPlannedDay = () => {
        const updatedPlannedDay = getUpdatedPlannedDay();
        PlannedDayController.create(updatedPlannedDay, setPlannedDay);
    };

    const updatePlannedDayAsLocked = () => {
        const updatedPlannedDay = getUpdatedPlannedDay();
        updatedPlannedDay.metadata!.locked = true;
        PlannedDayController.update(updatedPlannedDay);
        setPlannedDay(updatedPlannedDay);
    };

    const updatePlannedDayAsUnlocked = () => {
        const newPlannedDay: PlannedDay = {
            id: plannedDay!.id,
            metadata: plannedDay!.metadata,
            plannedTasks: plannedDay!.plannedTasks
        };
        newPlannedDay.metadata!.locked = false;

        PlannedDayController.update(newPlannedDay);
        setPlannedDay(newPlannedDay);
    };

    const toggleLock = () => {
        const lockPlans = !locked;
        setLocked(lockPlans);

        if (lockPlans) {
            if (isNewPlannedDay()) {
                createPlannedDay();
            } else {
                updatePlannedDayAsLocked();
            }
        } else {
            updatePlannedDayAsUnlocked();
        }
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
                    {locked ? "You can unlock tomorrow's schedule if you need to make changes." : "Select the tasks that you intend on completing tomorrow. You can update the start time and duration. Lock in your plans once you feel confident about tomorrows schedule!"}
                </Text>
                {
                    taskViews.length > 0
                        ?
                        <ScrollView style={{ backgroundColor: colors.background_medium, paddingTop: 5, height: "97%" }}>
                            {taskViews}
                        </ScrollView>
                        :
                        <View style={{ height: "97%", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: colors.secondary_text, paddingLeft: 40, paddingRight: 40 }} >
                                You have no tasks scheduled to run on a {tomorrowCapitalized}. Head on over to the Tasks tab to configure some.
                            </Text>
                        </View>
                }
            </View>

            <View style={{ flex: 1.5, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <EmbtrButton buttonText={locked ? 'Unlock Plans 🔓' : 'Lock Plans 🔒'} callback={() => { toggleLock() }} />
            </View>
        </View>
    );
};