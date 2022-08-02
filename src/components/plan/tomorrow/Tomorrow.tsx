import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { getTomorrowDayOfWeek, TaskModel } from 'src/controller/planning/TaskController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Countdown } from 'src/components/common/time/Countdown';
import PlannedDayController, { createPlannedTask, createPlannedTaskByPlannedTask, getTomorrowKey, PlannedDay, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import PillarController from 'src/controller/pillar/PillarController';
import GoalController, { FAKE_GOAL, GoalModel } from 'src/controller/planning/GoalController';
import { FAKE_PILLAR, PillarModel } from 'src/model/PillarModel';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface UpdatedPlannedTask {
    checked: boolean,
    startTime: number,
    duration: number
}

export const Tomorrow = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay | undefined>(undefined);

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<Boolean | undefined>(undefined);
    const [updatedPlannedTasks, setUpdatedPlannedTasks] = React.useState(new Map<string, UpdatedPlannedTask>());

    const tomorrow = getTomorrowDayOfWeek();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                PillarController.getPillars(uid, setPillars);
            }
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTasks(getAuth().currentUser!.uid, (allTasks: TaskModel[]) => {
                setTasks(allTasks);
                PlannedDayController.get(getAuth().currentUser?.uid!, getTomorrowKey(), (plannedDay: PlannedDay) => {
                    setPlannedDay(plannedDay);

                    let updatedPlannedTasks: Map<string, UpdatedPlannedTask> = new Map<string, UpdatedPlannedTask>();
                    tasks.forEach(task => {
                        const updatedPlannedTask: UpdatedPlannedTask = {
                            checked: false,
                            startTime: 0,
                            duration: 0
                        };
                        updatedPlannedTasks.set(task.id!, updatedPlannedTask);
                    });

                    plannedDay.plannedTasks.forEach(plannedTask => {
                        const updatedPlannedTask: UpdatedPlannedTask = {
                            checked: true,
                            startTime: plannedTask.startMinute!,
                            duration: plannedTask.duration!
                        };

                        if (plannedTask.routine.id) {
                            updatedPlannedTasks.set(plannedTask.routine.id!, updatedPlannedTask);
                        } else {
                            updatedPlannedTasks.set(plannedTask.id!, updatedPlannedTask);
                        }
                    });

                    setUpdatedPlannedTasks(updatedPlannedTasks);
                });
            });
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (!plannedDay) {
                return;
            }

            if (plannedDay.metadata?.locked) {
                setLocked(plannedDay.metadata.locked);
            } else {
                setLocked(false);
            }
        }, [plannedDay])
    );

    useFocusEffect(
        React.useCallback(() => {
            let taskViews: JSX.Element[] = [];

            let plannedTasks = plannedDay?.plannedTasks;

            if (plannedTasks) {
                plannedTasks.sort((a, b) => (a.startMinute! > b.startMinute!) ? 1 : -1);
            }

            // get all current planned tasks
            plannedDay?.plannedTasks.forEach(plannedTask => {

                let taskGoal: GoalModel = FAKE_GOAL;
                let taskPillar: PillarModel = FAKE_PILLAR;

                goals.forEach(goal => {
                    if (goal.id === plannedTask.routine.goalId) {
                        taskGoal = goal;
                        return;
                    }
                });

                pillars.forEach(pillar => {
                    if (pillar.id === taskGoal.pillarId) {
                        taskPillar = pillar;
                        return;
                    }
                });

                taskViews.push(
                    <View key={plannedTask.routine.id + "_locked"} style={{ paddingBottom: 5, alignItems: "center" }}>
                        <PlanningTask plannedTask={plannedTask} locked={locked === true} isChecked={updatedPlannedTasks.get(plannedTask.routine.id ? plannedTask.routine.id : plannedTask.id!)?.checked !== false} onCheckboxToggled={onChecked} onUpdate={onPlannedTaskUpdate} goal={taskGoal} pillar={taskPillar} />
                    </View>);
            });

            if (locked === false) {
                // get the rest of the tasks
                tasks.forEach(task => {
                    let taskGoal: GoalModel = FAKE_GOAL;
                    let taskPillar: PillarModel = FAKE_PILLAR;

                    goals.forEach(goal => {
                        if (goal.id === task.goalId) {
                            taskGoal = goal;
                            return;
                        }
                    });

                    pillars.forEach(pillar => {
                        if (pillar.id === taskGoal.pillarId) {
                            taskPillar = pillar;
                            return;
                        }
                    });

                    let display = true;
                    plannedDay?.plannedTasks.forEach(plannedTask => {
                        if (plannedTask.routine.id === task.id) {
                            display = false;
                            return;
                        }
                    });

                    if (display) {
                        const isChecked = updatedPlannedTasks.get(task.id!)?.checked
                        taskViews.push(
                            <View key={task.id} style={{ paddingBottom: 5, alignItems: "center" }}>
                                <PlanningTask task={task} locked={false} isChecked={isChecked === true} onCheckboxToggled={onChecked} onUpdate={onPlannedTaskUpdate} goal={taskGoal} pillar={taskPillar} />
                            </View>
                        );
                    }
                });
            }

            setTaskViews(taskViews);
        }, [locked, tasks, plannedDay, updatedPlannedTasks])
    );

    const onChecked = (taskId: string, checked: boolean) => {
        let newUpdatedPlannedTasks: Map<string, UpdatedPlannedTask> = new Map(updatedPlannedTasks);
        let newUpdatedPlannedTask = newUpdatedPlannedTasks.get(taskId);

        if (newUpdatedPlannedTask) {
            newUpdatedPlannedTask.checked = checked;
        } else {
            newUpdatedPlannedTask = {
                checked: checked,
                startTime: 8 * 60,
                duration: 30
            }
        }

        newUpdatedPlannedTasks.set(taskId, newUpdatedPlannedTask);
        setUpdatedPlannedTasks(newUpdatedPlannedTasks);
    };

    const onPlannedTaskUpdate = (taskId: string, startTime: number, duration: number) => {
        let newUpdatedPlannedTasks: Map<string, UpdatedPlannedTask> = new Map(updatedPlannedTasks);
        let newUpdatedPlannedTask = newUpdatedPlannedTasks.get(taskId);

        if (newUpdatedPlannedTask) {
            newUpdatedPlannedTask.startTime = startTime;
            newUpdatedPlannedTask.duration = duration;
            newUpdatedPlannedTasks.set(taskId, newUpdatedPlannedTask);
            setUpdatedPlannedTasks(newUpdatedPlannedTasks);
            updatePlannedDayAsLocked()
        }
    }

    /*
     * move me to the controller!
    */
    const getUpdatedPlannedDay = (): PlannedDay => {
        let plannedtasks: PlannedTaskModel[] = [];

        plannedDay?.plannedTasks.forEach(plannedTask => {
            if (plannedTask.routine.id) {
                return;
            }

            const updatedPlannedTask = updatedPlannedTasks.get(plannedTask.id!);
            if (updatedPlannedTask) {
                const taskIsEnabled = updatedPlannedTask?.checked !== false;
                if (taskIsEnabled) {
                    const newPlannedTask: PlannedTaskModel = createPlannedTaskByPlannedTask(plannedTask, updatedPlannedTask.startTime, updatedPlannedTask.duration);
                    plannedtasks.push(newPlannedTask);
                }
            }
        });

        tasks.forEach(task => {
            const updatedPlannedTask = updatedPlannedTasks.get(task.id!);
            if (updatedPlannedTask) {
                const taskIsEnabled = updatedPlannedTask?.checked !== false;
                if (taskIsEnabled) {
                    const plannedTask: PlannedTaskModel = createPlannedTask(task, updatedPlannedTask.startTime, updatedPlannedTask.duration);
                    plannedtasks.push(plannedTask);
                }
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

    let [fontsLoaded] = useFonts({
        Poppins_500Medium, Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={{ color: colors.text, fontFamily: "Poppins_500Medium", fontSize: 14, paddingTop: 25 }}>
                    Plan your
                    <Text style={{ color: colors.tomorrow_selected_indicator }}> {tomorrowCapitalized}</Text>
                </Text>

                <View>
                    <Text style={{ color: colors.text, fontSize: 10, fontFamily: "Poppins_400Regular" }}>
                        Starts in <Countdown />
                    </Text>
                </View>
            </View>

            <View style={{ flex: 8 }}>
                {
                    taskViews.length > 0
                        ?
                        <ScrollView style={{ backgroundColor: colors.background, paddingTop: 5, height: "97%", width: "100%" }}>
                            <View style={{ alignItems: "center" }}>
                                {taskViews}
                            </View>
                        </ScrollView>
                        :
                        <View style={{ height: "97%", alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: colors.secondary_text }} >
                                You have no tasks or habits scheduled. Let's change that!
                            </Text>
                            <View style={{ flexDirection: "row", paddingTop: 4 }}>
                                <View style={{ paddingRight: 5 }}><Text onPress={() => { navigation.navigate("CreateOneTimeTask", { dayKey: getTomorrowKey() }) }} style={{ color: colors.tab_selected, fontFamily: "Poppins_400Regular" }} > create a task</Text></View>
                                <View style={{ paddingLeft: 5 }}><Text onPress={() => { toggleLock() }} style={{ color: colors.tab_selected, fontFamily: "Poppins_400Regular" }} > select a habit</Text></View>
                            </View>
                        </View>
                }
            </View>

            <View style={{ flex: 1.5, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: "80%" }}>
                    <EmbtrButton buttonText={locked ? 'Change Tasks' : 'Confirm Tasks'} callback={() => { toggleLock() }} />
                </View>
            </View>
        </View>
    );
};