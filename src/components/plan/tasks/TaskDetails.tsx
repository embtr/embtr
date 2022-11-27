import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { HabitHistoryElementModel, TaskModel } from 'src/controller/planning/TaskController';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { format, formatDistance } from 'date-fns';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import { HabitHistory } from '../planning/HabitHistory';

export const TaskDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const route = useRoute<RouteProp<PlanTabScreens, 'TaskDetails'>>();
    const [task, setTask] = React.useState<TaskModel>();
    const [goal, setGoal] = React.useState<GoalModel>();
    const [pillar, setPillar] = React.useState<PillarModel>();

    React.useEffect(() => {
        TaskController.getTask(route.params.id, setTask);
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

    const fetchPillar = async () => {
        if (!goal?.pillarId) {
            return;
        }

        const pillar = await PillarController.get(getCurrentUid(), goal.pillarId);
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

    let allTasks: HabitHistoryElementModel[] = [];
    allTasks = allTasks.concat(task?.history?.incomplete ? task.history.incomplete : []);
    allTasks = allTasks.concat(task?.history?.complete ? task.history.complete : []);
    allTasks = allTasks.concat(task?.history?.failed ? task.history.failed : []);
    allTasks = allTasks.sort((a, b) => (a.dayKey < b.dayKey ? 1 : 0));

    let historyViews: JSX.Element[] = [];
    allTasks.forEach((history) => {
        historyViews.push(
            <View key={history.dayKey + history.name} style={{ paddingTop: 5 }}>
                <HabitHistory history={history} />
            </View>
        );
    });

    if (!task) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const daysOld = formatDistance(task.added.toDate(), new Date());
    const incompletedTasks = task.history ? task.history.incomplete.length : 0;
    const completedTasks = task.history ? task.history.complete.length : 0;
    const failedTasks = task.history ? task.history.failed.length : 0;

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

            <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 10 }}>
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

                        <View style={{ paddingTop: 20, width: '100%' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font }}>History</Text>
                            {historyViews}
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
