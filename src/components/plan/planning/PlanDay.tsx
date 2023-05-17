import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';

interface Props {
    plannedDay: PlannedDayModel;
    onTaskUpdated: Function;
    setShowSelectTaskModal: Function;
    onCompleteDay: Function;
}

export const PlanDay = ({
    plannedDay,
    onTaskUpdated,
    setShowSelectTaskModal,
    onCompleteDay,
}: Props) => {
    const { colors } = useTheme();
    const [taskViews, setTaskViews] = useState<JSX.Element[]>([]);
    const [allTasksAreComplete, setAllTasksAreComplete] = useState<boolean>(false);

    useEffect(() => {
        let taskViews: JSX.Element[] = [];
        let allTasksAreComplete = true;

        // get all current planned tasks
        plannedDay?.plannedTasks?.forEach((plannedTask) => {
            if (
                !(
                    plannedTask.count === plannedTask.completedCount &&
                    (plannedTask.count ?? 0) > 0 &&
                    plannedTask.status !== 'FAILED'
                )
            ) {
                allTasksAreComplete = false;
            }
            taskViews.push(
                <View
                    key={plannedTask.id + '_locked'}
                    style={{
                        paddingBottom: 5,
                        alignItems: 'center',
                        width: '97%',
                    }}
                >
                    <PlannableTask
                        plannedTask={plannedTask}
                        isEnabled={true}
                        onUpdateTask={onTaskUpdated}
                    />
                </View>
            );
        });

        setTaskViews(taskViews);
        setAllTasksAreComplete(allTasksAreComplete);
    }, [plannedDay]);

    const dayIsComplete = plannedDay.plannedDayResults && plannedDay.plannedDayResults[0].active;

    return (
        <Screen>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {taskViews.length > 0 ? (
                    <ScrollView
                        style={{
                            backgroundColor: colors.background,
                            paddingTop: 5,
                            height: '97%',
                            width: '100%',
                        }}
                    >
                        {allTasksAreComplete &&
                            (!dayIsComplete ? (
                                <View
                                    style={{
                                        marginBottom: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: colors.secondary_text,
                                        borderRadius: 5,
                                        width: '97%',
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        marginLeft: '1.5%',
                                    }}
                                >
                                    <Text style={{ color: colors.secondary_text }}>
                                        Congratulations, all of your tasks are complete!
                                    </Text>
                                    <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                        <View style={{ paddingRight: 5 }}>
                                            <Text
                                                onPress={() => {
                                                    onCompleteDay();
                                                }}
                                                style={{
                                                    color: colors.tab_selected,
                                                    fontFamily: 'Poppins_400Regular',
                                                }}
                                            >
                                                {' '}
                                                Complete Day
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View
                                    style={{
                                        marginBottom: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: colors.progress_bar_complete,
                                        borderRadius: 5,
                                        width: '97%',
                                        paddingTop: 15,
                                        paddingBottom: 15,
                                        marginLeft: '1.5%',
                                    }}
                                >
                                    <Text style={{ color: colors.secondary_text }}>
                                        Day Complete!
                                    </Text>
                                </View>
                            ))}
                        <View
                            style={{
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            {taskViews}
                        </View>
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
        </Screen>
    );
};
