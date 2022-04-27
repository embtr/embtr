import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { getTomorrowDayOfWeek, TaskModel } from 'src/controller/planning/TaskController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Countdown } from 'src/components/common/time/Countdown';
import TodayController, { getTomorrowKey, TodayModel, PlannedTask } from 'src/controller/planning/TodayController';
import { Plan } from 'src/components/plan/Plan';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [todayModel, setTodayModel] = React.useState<TodayModel | undefined>(undefined);

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<boolean>(false);
    const [checkedTasks, setCheckedTasks] = React.useState(new Map<string, boolean>());

    const tomorrow = getTomorrowDayOfWeek();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasksForDay(getAuth().currentUser!.uid, tomorrow, setTasks);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            TodayController.get(getTomorrowKey(), setTodayModel);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (todayModel?.metadata) {
                setLocked(todayModel?.metadata?.locked);
            }
        }, [todayModel])
    );

    useFocusEffect(
        React.useCallback(() => {
            let taskViews: JSX.Element[] = [];

            if (locked) {
                todayModel?.plannedTasks.forEach(plannedTask => {
                    taskViews.push(<View key={plannedTask.routine.id} style={{ paddingBottom: 5 }}><Plan task={plannedTask.routine} /></View>);
                });
            } else {
                tasks.forEach(task => {
                    taskViews.push(<View key={task.id} style={{ paddingBottom: 5 }}><PlanningTask task={task} isChecked={checkedTasks.get(task.id!) !== false} onCheckboxToggled={onChecked} /></View>);
                });
            }

            setTaskViews(taskViews);
        }, [locked, tasks, todayModel, checkedTasks])
    );

    const onChecked = (taskId: string, checked: boolean) => {
        let newCheckedTasks: Map<string, boolean> = new Map(checkedTasks);
        newCheckedTasks.set(taskId, checked);
        setCheckedTasks(newCheckedTasks);
    };

    /*
     * move me to the controller!
    */
    const getUpdatedTodayModel = (): TodayModel => {
        let plannedtasks: PlannedTask[] = [];
        tasks.forEach(task => {
            if (checkedTasks.get(task.id!) !== false) {
                const plannedTask: PlannedTask = {
                    routine: task
                }

                plannedtasks.push(plannedTask);
            }
        });

        const newTodayModel: TodayModel = {
            id: todayModel?.id,
            metadata: todayModel?.metadata,
            plannedTasks: plannedtasks
        };

        return newTodayModel;
    };

    const isNewTodayModel = (): boolean => {
        return todayModel?.metadata === undefined;
    };

    const createTodayModel = () => {
        const updatedTodayModel = getUpdatedTodayModel();
        TodayController.create(updatedTodayModel, setTodayModel);
    };

    const updateTodayModelAsLocked = () => {
        const updatedTodayModel = getUpdatedTodayModel();
        updatedTodayModel.metadata!.locked = true;
        TodayController.update(updatedTodayModel);
        setTodayModel(updatedTodayModel);
    };

    const updateTodayModelAsUnlocked = () => {
        const newTodayModel: TodayModel = {
            id: todayModel!.id,
            metadata: todayModel!.metadata,
            plannedTasks: todayModel!.plannedTasks
        };
        newTodayModel.metadata!.locked = false;

        TodayController.update(newTodayModel);
        setTodayModel(newTodayModel);
    };

    const toggleLock = () => {
        const lockPlans = !locked;
        setLocked(lockPlans);

        if (lockPlans) {
            if (isNewTodayModel()) {
                createTodayModel();
            } else {
                updateTodayModelAsLocked();
            }
        } else {
            updateTodayModelAsUnlocked();
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