import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import GoalController, { FAKE_GOAL, getProgressPercent, GoalModel } from 'src/controller/planning/GoalController';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { format, formatDistance } from 'date-fns';
import { FAKE_PILLAR, PillarModel } from 'src/model/PillarModel';
import PillarController from 'src/controller/pillar/PillarController';
import UserController, { FAKE_USER, UserModel } from 'src/controller/user/UserController';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { COMPLETE, FAILED, INCOMPLETE } from 'src/util/constants';
import { PlannedTaskHistory } from '../history/PlannedTaskHistory';

export const GoalDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<PlanTabScreens, 'GoalDetails'>>();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [goal, setGoal] = React.useState<GoalModel>(FAKE_GOAL);
    const [user, setUser] = React.useState<UserModel>(FAKE_USER);
    const [pillar, setPillar] = React.useState<PillarModel>(FAKE_PILLAR);
    const [taskHistory, setTaskHistory] = React.useState<PlannedTaskModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoal(getAuth().currentUser!.uid, route.params.id, setGoal);
        }, [])
    );

    React.useEffect(() => {
        const fetch = async () => {
            const user = await UserController.get(goal.uid);
            setUser(user);
        };

        if (goal.uid) {
            fetch();
        }
    }, [goal]);

    React.useEffect(() => {
        if (!user.uid || !goal.pillarId) {
            return;
        }

        const fetch = async () => {
            const pillar = await PillarController.get(user, goal.pillarId!);
            if (pillar) {
                setPillar(pillar);
            }
        };

        fetch();
    }, [user, goal]);

    React.useEffect(() => {
        const fetch = async () => {
            if (!goal?.id) {
                return;
            }

            const tasks = await PlannedTaskController.getGoalHistory(goal.id);
            setTaskHistory(tasks);
        };

        fetch();
    }, [goal]);

    const closeMenu = useAppSelector(getCloseMenu);

    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                if (goal.id) {
                    navigation.navigate('CreateEditGoal', { id: goal.id });
                    closeMenu();
                }
            },
        },
        {
            name: 'Archive',
            onPress: async () => {
                await GoalController.archiveGoal(goal);
                navigation.goBack();
            },
        },
        {
            name: 'Complete',
            onPress: () => {},
        },
        {
            name: 'Fail',
            onPress: () => {},
        },
    ];

    const completedTasks = taskHistory.filter((e) => e.status === COMPLETE).length;
    const incompletedTasks = taskHistory.filter((e) => e.status === INCOMPLETE).length;
    const failedTasks = taskHistory.filter((e) => e.status === FAILED).length;
    const daysOld = formatDistance(goal.added.toDate(), new Date());

    const progressPercent = getProgressPercent(goal);

    return (
        <Screen>
            <Banner
                name={'Goal Details'}
                leftIcon={'arrow-back'}
                leftRoute={'BACK'}
                rightIcon={'ellipsis-horizontal'}
                menuOptions={createEmbtrMenuOptions(menuItems)}
            />
            <EmbtrMenuCustom />

            <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>{goal.name}</Text>

                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}>
                        {goal.description}
                    </Text>
                </View>

                <View style={{ paddingTop: 15, marginLeft: 10, marginRight: 10 }}>
                    <HorizontalLine />
                </View>

                <View style={{ paddingLeft: 10, paddingTop: 15 }}>
                    <View style={{ width: '100%', alignContent: 'center', paddingTop: 5 }}>
                        <ProgressBar progress={progressPercent} />
                    </View>
                </View>

                <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <GoalDetailAttribute attribute={'Created'} value={format(goal.added.toDate(), 'MMMM dd, yyyy')} />
                        <GoalDetailAttribute attribute={'Days Remaining'} value={daysOld} />
                        <GoalDetailAttribute attribute={'Pillar'} value={pillar.name} />
                    </View>

                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                        <GoalDetailAttribute attribute={'Tasks Completed'} value={completedTasks + ' Task' + (completedTasks === 1 ? '' : 's')} />
                        <GoalDetailAttribute attribute={'Tasks Incomplete'} value={incompletedTasks + ' Task' + (incompletedTasks === 1 ? '' : 's')} />
                        <GoalDetailAttribute attribute={'Tasks Failed'} value={failedTasks + ' Task' + (failedTasks === 1 ? '' : 's')} />
                    </View>

                    <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                        <GoalDetailAttribute attribute={'Completion Streak'} value={'15 Days'} isFake={true} />
                        <GoalDetailAttribute attribute={'Tasks Failed'} value={'10'} isFake={true} />
                        <GoalDetailAttribute attribute={'Completion Rate'} value={'60% Completed'} isFake={true} />
                    </View>
                </View>

                <PlannedTaskHistory history={taskHistory} />
            </View>
        </Screen>
    );
};
