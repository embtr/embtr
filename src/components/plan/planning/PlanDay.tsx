import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { PlanningTask } from 'src/components/plan/planning/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import PillarController from 'src/controller/pillar/PillarController';
import GoalController, { FAKE_GOAL, GoalModel } from 'src/controller/planning/GoalController';
import { FAKE_PILLAR, PillarModel } from 'src/model/PillarModel';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';

interface Props {
    plannedDay: PlannedDay;
    onTaskUpdated: Function;
}

export const PlanDay = ({ plannedDay, onTaskUpdated }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [tasks, setTasks] = React.useState<TaskModel[]>([]);

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState(plannedDay.metadata?.locked === true);

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
            PillarController.getPillars(getAuth().currentUser!.uid, setPillars);
            TaskController.getTasks(getAuth().currentUser!.uid, setTasks);
        }, [])
    );

    /*
     * This section builds the Views for both
     * the selected tasks as well as the unselected days.
     */
    useFocusEffect(
        React.useCallback(() => {
            let taskViews: JSX.Element[] = [];

            // get all current planned tasks
            plannedDay?.plannedTasks.forEach((plannedTask) => {
                let taskGoal: GoalModel = FAKE_GOAL;
                let taskPillar: PillarModel = FAKE_PILLAR;

                goals.forEach((goal) => {
                    if (goal.id === plannedTask.routine.goalId) {
                        taskGoal = goal;
                        return;
                    }
                });

                pillars.forEach((pillar) => {
                    if (pillar.id === taskGoal.pillarId) {
                        taskPillar = pillar;
                        return;
                    }
                });

                taskViews.push(
                    <View key={plannedTask.routine.id + '_locked'} style={{ paddingBottom: 5, alignItems: 'center' }}>
                        <PlanningTask plannedTask={plannedTask} locked={locked} isChecked={true} onUpdate={onTaskUpdated} goal={taskGoal} pillar={taskPillar} />
                    </View>
                );
            });

            if (locked === false) {
                // get the rest of the tasks
                tasks.forEach((task) => {
                    let taskGoal: GoalModel = FAKE_GOAL;
                    let taskPillar: PillarModel = FAKE_PILLAR;

                    goals.forEach((goal) => {
                        if (goal.id === task.goalId) {
                            taskGoal = goal;
                            return;
                        }
                    });

                    pillars.forEach((pillar) => {
                        if (pillar.id === taskGoal.pillarId) {
                            taskPillar = pillar;
                            return;
                        }
                    });

                    let display = true;
                    plannedDay?.plannedTasks.forEach((plannedTask) => {
                        if (plannedTask.routine.id === task.id) {
                            display = false;
                            return;
                        }
                    });

                    if (display) {
                        taskViews.push(
                            <View key={task.id} style={{ paddingBottom: 5, alignItems: 'center' }}>
                                <PlanningTask task={task} locked={false} isChecked={false} onUpdate={onTaskUpdated} goal={taskGoal} pillar={taskPillar} />
                            </View>
                        );
                    }
                });
            }

            setTaskViews(taskViews);
        }, [locked, tasks, plannedDay])
    );

    const toggleLock = () => {};

    return (
        <Screen>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flex: 8 }}>
                    {taskViews.length > 0 ? (
                        <ScrollView style={{ backgroundColor: colors.background, paddingTop: 5, height: '97%', width: '100%' }}>
                            <View style={{ alignItems: 'center' }}>{taskViews}</View>
                        </ScrollView>
                    ) : (
                        <View style={{ height: '97%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: colors.secondary_text }}>You have no tasks planned. Let's change that!</Text>
                            <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                <View style={{ paddingRight: 5 }}>
                                    <Text
                                        onPress={() => {
                                            navigation.navigate('CreateOneTimeTask', { dayKey: plannedDay.id! });
                                        }}
                                        style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                                    >
                                        {' '}
                                        create a task
                                    </Text>
                                </View>
                                {goals.length > 0 ? (
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            onPress={() => {
                                                toggleLock();
                                            }}
                                            style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                                        >
                                            {' '}
                                            select a task
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            onPress={() => {
                                                navigation.navigate('CreateDailyTask');
                                            }}
                                            style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                                        >
                                            {' '}
                                            create a task
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                <View style={{ flex: 1.5, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%' }}>
                        <EmbtrButton
                            buttonText={locked ? 'Change Tasks' : 'Confirm Tasks'}
                            callback={() => {
                                toggleLock();
                            }}
                        />
                    </View>
                </View>
            </View>
        </Screen>
    );
};
