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
import GoalController, { FAKE_GOAL, getCompletedTasksFromGoal, GoalModel } from 'src/controller/planning/GoalController';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { GoalDetailAttribute } from 'src/components/plan/goals/GoalDetailAttribute';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';

export const GoalDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<PlanTabScreens, 'GoalDetails'>>();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [goal, setGoal] = React.useState<GoalModel>(FAKE_GOAL);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoal(getAuth().currentUser!.uid, route.params.id, setGoal);
        }, [])
    );

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

    const tasksCompleted = getCompletedTasksFromGoal(goal).length;

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
                <View style={{ paddingLeft: 10 }}>
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
                            <ProgressBar progress={1} />
                        </View>
                    </View>

                    <View style={{ paddingTop: 20, paddingBottom: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <GoalDetailAttribute attribute={'Created'} value={'Jun 20 2022'} />
                            <GoalDetailAttribute attribute={'Days Remaining'} value={'45 Days'} />
                            <GoalDetailAttribute attribute={'Pillar'} value={'Fitness'} />
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <GoalDetailAttribute attribute={'Tasks Completed'} value={tasksCompleted + ' Tasks'} />
                            <GoalDetailAttribute attribute={'Tasks Failed'} value={'10'} />
                            <GoalDetailAttribute attribute={'Completion Rate'} value={'60% Completed'} />
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <GoalDetailAttribute attribute={'Completion Streak'} value={'15 Days'} />
                            <GoalDetailAttribute attribute={'Tasks Failed'} value={'10'} />
                            <GoalDetailAttribute attribute={'Completion Rate'} value={'60% Completed'} />
                        </View>

                        <View style={{ paddingTop: 20, width: '100%' }}></View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
