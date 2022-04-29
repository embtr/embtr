import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import PlannedDayController, { getTodayKey, PlannedDay } from 'src/controller/planning/PlannedDayController';
import { PlannedTask } from 'src/components/today/PlannedTask';

export const Today = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [plannedToday, setPlannedToday] = React.useState<PlannedDay>();

    useFocusEffect(
        React.useCallback(() => {
            PlannedDayController.get(getTodayKey(), setPlannedToday);
        }, [])
    );

    let taskViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        taskViews.push(
            <PlannedTask key={plannedTask.id} plannedTask={plannedTask} />
        );
    });

    return (
        <Screen>
            <View style={{ height: "100%" }}>
                <ScrollView style={{ backgroundColor: colors.background_medium }}>
                    {taskViews}
                </ScrollView>
            </View>
        </Screen>
    );
};