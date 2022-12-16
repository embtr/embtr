import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getCurrentUser } from 'src/redux/user/GlobalState';
import { format, formatDistance } from 'date-fns';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { COMPLETE, FAILED, INCOMPLETE } from 'src/util/constants';
import { PlannedTaskHistory } from '../history/PlannedTaskHistory';

export const TaskDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'TaskDetails'>>();

    const [task, setTask] = React.useState<TaskModel>();
    const [goal, setGoal] = React.useState<GoalModel>();
    const [pillar, setPillar] = React.useState<PillarModel>();
    const [taskHistory, setTaskHistory] = React.useState<PlannedTaskModel[]>([]);

    React.useEffect(() => {
        TaskController.getHabit(route.params.id, setTask);
    }, []);

    React.useEffect(() => {
        if (!task?.goalId) {
            return;
        }

        GoalController.getGoal(getCurrentUid(), task.goalId, setGoal);
    }, [task]);

    React.useEffect(() => {
        fetchPillar();
    }, [task]);

    React.useEffect(() => {
        const fetch = async () => {
            if (!task?.id) {
                return;
            }

            const tasks = await PlannedTaskController.getHabitHistory(task.id);
            setTaskHistory(tasks);
        };

        fetch();
    }, [task]);

    const fetchPillar = async () => {
        if (!goal?.pillarId) {
            return;
        }

        const currentUser = useAppSelector(getCurrentUser);
        const pillar = await PillarController.get(currentUser, goal.pillarId);
        setPillar(pillar);
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                if (task?.id) {
                    navigation.navigate('CreateEditHabit', { id: task?.id });
                    closeMenu();
                }
            },
        },
        {
            name: 'Archive',
            onPress: () => {
                if (isDesktopBrowser()) {
                    if (confirm("archive task '" + task?.name + "'")) {
                        if (task) {
                            TaskController.archiveTask(task, () => {
                                navigation.goBack();
                            });
                        }
                    }
                } else {
                    Alert.alert('Archive Task?', "Archive task '" + route.name + "'?", [
                        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                        {
                            text: 'Archive',
                            onPress: () => {
                                if (task) {
                                    TaskController.archiveTask(task, () => {
                                        navigation.goBack();
                                    });
                                }
                            },
                        },
                    ]);
                }
            },
        },
    ];

    if (!task) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const daysOld = formatDistance(task.added.toDate(), new Date());
    const completedTasks = taskHistory.filter((e) => e.status === COMPLETE).length;
    const incompletedTasks = taskHistory.filter((e) => e.status === INCOMPLETE).length;
    const failedTasks = taskHistory.filter((e) => e.status === FAILED).length;

    return (
        <Screen>
            <Banner
                name={'Habit Details'}
                leftIcon={'arrow-back'}
                leftRoute={'BACK'}
                rightIcon={'ellipsis-horizontal'}
                menuOptions={createEmbtrMenuOptions(menuItems)}
            />
            <EmbtrMenuCustom />

            <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>{task?.name}</Text>
                <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}>
                    {task?.description}
                </Text>
            </View>

            <View style={{ paddingTop: 15, marginLeft: 10, marginRight: 10 }}>
                <HorizontalLine />
            </View>

            <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <GoalDetailAttribute attribute={'Created'} value={format(task?.added.toDate(), 'MMMM dd, yyyy')} />
                    <GoalDetailAttribute attribute={'Days Old'} value={daysOld} />
                    <GoalDetailAttribute attribute={'Pillar'} value={pillar?.id ? pillar.id : 'N/A'} />
                </View>

                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                    <GoalDetailAttribute attribute={'Tasks Completed'} value={completedTasks + (completedTasks === 1 ? ' Task' : ' Tasks')} />
                    <GoalDetailAttribute attribute={'Tasks Failed'} value={failedTasks + (failedTasks === 1 ? ' Task' : ' Tasks')} />
                    <GoalDetailAttribute attribute={'Tasks Incomplete'} value={incompletedTasks + (incompletedTasks === 1 ? ' Task' : ' Tasks')} />
                </View>
            </View>

            <PlannedTaskHistory history={taskHistory} />
        </Screen>
    );
};
