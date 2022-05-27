import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { getTomorrowDayOfWeek, TaskModel } from 'src/controller/planning/TaskController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Countdown } from 'src/components/common/time/Countdown';
import PlannedDayController, { createPlannedTask, getTomorrowKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Task } from 'src/components/plan/Task';

export const Tomorrow = () => {
    const { colors } = useTheme();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<boolean>(false);
    const [checkedTasks, setCheckedTasks] = React.useState(new Map<string, boolean>());

    const tomorrow = getTomorrowDayOfWeek();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
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
            let taskViews: JSX.Element[] = [];

            if (locked) {
                plannedDay?.plannedTasks.forEach(plannedTask => {
                    taskViews.push(<View key={plannedTask.routine.id} style={{ paddingBottom: 5 }}><Task task={plannedTask.routine} /></View>);
                });
            } else {
                tasks.forEach(task => {
                    taskViews.push(<View key={task.id} style={{ paddingBottom: 5 }}><PlanningTask task={task} isChecked={checkedTasks.get(task.id!) !== false} onCheckboxToggled={onChecked} /></View>);
                });
            }

            setTaskViews(taskViews);
        }, [locked, tasks, plannedDay, checkedTasks])
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
        let plannedtasks: PlannedTaskModel[] = [];
        tasks.forEach(task => {
            if (checkedTasks.get(task.id!) !== false) {
                const plannedTask: PlannedTaskModel = createPlannedTask(task, 0, 60);
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
        PlannedDayController.replace(updatedPlannedDay);
        setPlannedDay(updatedPlannedDay);
    };

    const updatePlannedDayAsUnlocked = () => {
        const newPlannedDay: PlannedDay = {
            id: plannedDay!.id,
            metadata: plannedDay!.metadata,
            plannedTasks: plannedDay!.plannedTasks
        };
        newPlannedDay.metadata!.locked = false;

        PlannedDayController.replace(newPlannedDay);
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
                <Text style={{ color: colors.text, textAlign: "center", fontSize: 17 }}>
                    Plan your
                    <Text style={{ color: colors.primary_border }}> {tomorrowCapitalized}</Text>
                </Text>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 10 }}>
                        Starts in <Countdown />
                    </Text>
                </View>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 11 }}>
                        <Text style={{ color: locked ? "green" : "red" }} >{locked ? "locked 🔒" : "unlocked 🔓"} </Text>
                    </Text>
                </View>
            </View>

            <View style={{ flex: 8 }}>
                {
                    taskViews.length > 0
                        ?
                        <ScrollView style={{ backgroundColor: colors.scroll_background, paddingTop: 5, height: "97%" }}>
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
                <EmbtrButton buttonText={locked ? 'Edit Plans 🔓' : 'Save Plans 🔒'} callback={() => { toggleLock() }} />
            </View>
        </View>
    );
};