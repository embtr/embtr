import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, Text, View } from 'react-native';
import { PlannedDayModel } from 'resources/models/PlannedDayModel';
import { Screen } from 'src/components/common/Screen';
import { PlanningTask } from 'src/components/plan/planning/PlanningTask';
import { useTheme } from 'src/components/theme/ThemeProvider';
import AccessLogController from 'src/controller/access_log/AccessLogController';
import { GoalModel } from 'src/controller/planning/GoalController';
import { PillarModel } from 'src/model/PillarModel';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    plannedDay: PlannedDayModel;
    onTaskUpdated: Function;
    onOpenHabitsModal: Function;
}

export const PlanDay = ({ plannedDay, onTaskUpdated, onOpenHabitsModal }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [pillars, setPillars] = React.useState<PillarModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            AccessLogController.addPlanningListPageAccesLog();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            let taskViews: JSX.Element[] = [];

            // get all current planned tasks
            plannedDay?.plannedTasks?.forEach((plannedTask) => {
                taskViews.push(
                    <View key={plannedTask.id + '_locked'} style={{ paddingBottom: 5, alignItems: 'center' }}>
                        <PlanningTask plannedTask={plannedTask} isChecked={true} onUpdate={onTaskUpdated} />
                    </View>
                );
            });

            setTaskViews(taskViews);
        }, [plannedDay])
    );

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
                                            //navigation.navigate('CreateEditOneTimeTask', { dayKey: plannedDay.dayKey });
                                        }}
                                        style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                                    >
                                        {' '}
                                        create a task
                                    </Text>
                                </View>
                                {goals.length > 0 && (
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            onPress={() => {
                                                onOpenHabitsModal();
                                            }}
                                            style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                                        >
                                            {' '}
                                            select habits
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Screen>
    );
};
