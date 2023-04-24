import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { Screen } from 'src/components/common/Screen';
import { PlanningTask } from 'src/components/plan/planning/PlanningTask';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    plannedDay: PlannedDayModel;
    onTaskUpdated: Function;
    setShowSelectTaskModal: Function;
}

export const PlanDay = ({ plannedDay, onTaskUpdated, setShowSelectTaskModal }: Props) => {
    const { colors } = useTheme();
    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            let taskViews: JSX.Element[] = [];

            // get all current planned tasks
            plannedDay?.plannedTasks?.forEach((plannedTask) => {
                taskViews.push(
                    <View
                        key={plannedTask.id + '_locked'}
                        style={{ paddingBottom: 5, alignItems: 'center' }}
                    >
                        <PlanningTask
                            plannedTask={plannedTask}
                            isChecked={true}
                            onUpdate={onTaskUpdated}
                        />
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
                        <ScrollView
                            style={{
                                backgroundColor: colors.background,
                                paddingTop: 5,
                                height: '97%',
                                width: '100%',
                            }}
                        >
                            <View style={{ alignItems: 'center' }}>{taskViews}</View>
                        </ScrollView>
                    ) : (
                        <View
                            style={{
                                height: '97%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ color: colors.secondary_text }}>
                                You have no tasks planned. Let's change that!
                            </Text>
                            <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                <View style={{ paddingRight: 5 }}>
                                    <Text
                                        onPress={() => {
                                            setShowSelectTaskModal(true);
                                        }}
                                        style={{
                                            color: colors.tab_selected,
                                            fontFamily: 'Poppins_400Regular',
                                        }}
                                    >
                                        {' '}
                                        create a task
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Screen>
    );
};
