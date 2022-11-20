import React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { StackNavigationProp } from '@react-navigation/stack';
import { createEmbtrMenuOptions, EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { GoalTask } from 'src/components/plan/goals/GoalTask';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';

export const TaskDetails = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const route = useRoute<RouteProp<PlanTabScreens, 'TaskDetails'>>();
    const [task, setTask] = React.useState<TaskModel | undefined>();

    useFocusEffect(
        React.useCallback(() => {
            TaskController.getTask(route.params.id, setTask);
        }, [])
    );

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                if (task?.id) {
                    navigation.navigate('EditHabit', { id: task?.id });
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
                            <GoalDetailAttribute attribute={'Created'} value={'Jun 20 2022'} />
                            <GoalDetailAttribute attribute={'Days Remaining'} value={'45 Days'} />
                            <GoalDetailAttribute attribute={'Pillar'} value={'Fitness'} />
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <GoalDetailAttribute attribute={'Tasks Completed'} value={'12 Tasks'} />
                            <GoalDetailAttribute attribute={'Tasks Failed'} value={'10'} />
                            <GoalDetailAttribute attribute={'Completion Rate'} value={'60% Completed'} />
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <GoalDetailAttribute attribute={'Completion Streak'} value={'15 Days'} />
                            <GoalDetailAttribute attribute={'Tasks Failed'} value={'10'} />
                            <GoalDetailAttribute attribute={'Completion Rate'} value={'60% Completed'} />
                        </View>

                        <View style={{ paddingTop: 20, width: '100%' }}>
                            <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font }}>History</Text>

                            <View style={{ paddingTop: 5 }}>
                                <GoalTask />
                            </View>
                            <View style={{ paddingTop: 5 }}>
                                <GoalTask />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
