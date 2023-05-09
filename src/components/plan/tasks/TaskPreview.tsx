import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import Toast from 'react-native-root-toast';
import React, { useEffect } from 'react';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { Habit, PlannedDay as PlannedDayModel, PlannedTask, Task } from 'resources/schema';
import TaskController from 'src/controller/planning/TaskController';
import { Ionicons } from '@expo/vector-icons';
import { HabitScrollSelector } from './HabitScrollSelector';
import { HabitIcon } from '../habit/HabitIcon';

/* Pog I was here - Cherkim */

interface Props {
    plannedDay: PlannedDayModel;
    task: Task;
    habits: Habit[];
}

export const TaskPreview = ({ plannedDay, task, habits }: Props) => {
    const { colors } = useTheme();

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [selectedHabit, setSelectedHabit] = React.useState<Habit>();
    const heightValue = React.useRef(new Animated.Value(0)).current;
    const [plannedTaskFromDatabase, setPlannedTaskFromDatabase] = React.useState<PlannedTask>();

    useEffect(() => {
        if (task?.taskHabitPreference?.length) {
            setSelectedHabit(task.taskHabitPreference[0].habit!);
        }
    }, []);

    const plannedTaskFromPlannedDay = plannedDay.plannedTasks?.find(
        (plannedTask) => plannedTask.task?.id === task.id
    );

    const plannedTask = plannedTaskFromDatabase || plannedTaskFromPlannedDay;
    const taskCount = plannedTask?.count || 0;

    const toggleExpand = () => {
        Animated.timing(heightValue, {
            toValue: isExpanded ? 0 : 80, // Set the target height value to 0 or the height you want to expand to
            duration: 100, // Set the duration of the animation
            useNativeDriver: false, // Make sure to set useNativeDriver to false for layout animations
        }).start();

        setIsExpanded(!isExpanded);
    };

    const onHabitSelected = async (habit: Habit) => {
        setSelectedHabit(habit);
        TaskController.updateHabitPreference(task, habit);
    };

    return (
        <View style={{ width: '97%' }}>
            <View
                style={[
                    { backgroundColor: colors.timeline_card_background, borderRadius: 9 },
                    CARD_SHADOW,
                ]}
            >
                <TouchableOpacity onPress={toggleExpand}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text
                                style={{
                                    color: colors.goal_primary_font,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 14,
                                }}
                            >
                                {task.title}
                            </Text>
                            <Text
                                style={{
                                    color: colors.goal_secondary_font,
                                    opacity: 0.9,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 10,
                                }}
                            >
                                {task.description}
                            </Text>
                        </View>

                        <View
                            style={{
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                            }}
                        >
                            <View
                                style={{
                                    height: 30,
                                    borderRadius: 5,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingRight: 5,
                                }}
                            >
                                {selectedHabit?.iconName && (
                                    <HabitIcon
                                        habit={selectedHabit}
                                        size={30}
                                        color={colors.text}
                                    />
                                )}
                            </View>

                            {taskCount > 0 && (
                                <View style={{ flexDirection: 'row' }}>
                                    {/*
                                     * PLANNED TASK COUNT
                                     */}
                                    <View
                                        style={{
                                            height: 30,
                                            borderRadius: 5,
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            paddingRight: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontFamily: POPPINS_REGULAR,
                                                fontSize: 18,
                                            }}
                                        >
                                            x{taskCount}
                                        </Text>
                                    </View>

                                    {/*
                                     *  REMOVE PLANNED TASK
                                     */}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            if (!plannedTask) {
                                                return;
                                            }

                                            plannedTask.habit = selectedHabit;
                                            plannedTask.habitId = selectedHabit?.id;
                                            const updatedPlannedTask =
                                                await PlannedTaskController.decrementCount(
                                                    plannedTask
                                                );

                                            setPlannedTaskFromDatabase(
                                                updatedPlannedTask.plannedTask
                                            );

                                            Toast.show('task removed!', {
                                                duration: Toast.durations.LONG,
                                            });
                                        }}
                                        style={{
                                            height: 30,
                                            borderRadius: 5,
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            paddingRight: 5,
                                        }}
                                    >
                                        <Ionicons
                                            name="md-remove-circle-outline"
                                            size={30}
                                            color={colors.toggle_background_selected}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/*
                             * ADD PLANNED TASK
                             */}
                            <TouchableOpacity
                                onPress={async () => {
                                    let taskToAdd = task;

                                    if (!task.id) {
                                        taskToAdd = await TaskController.createViaApi(task.title!);
                                    }

                                    if (!plannedTask) {
                                        const updatedPlannedTask =
                                            await PlannedTaskController.addTaskViaApi(
                                                plannedDay,
                                                taskToAdd,
                                                selectedHabit
                                            );
                                        setPlannedTaskFromDatabase(updatedPlannedTask.plannedTask);
                                    } else {
                                        plannedTask.habit = selectedHabit;
                                        plannedTask.habitId = selectedHabit?.id;
                                        const updatedPlannedTask =
                                            await PlannedTaskController.incrementCount(plannedTask);
                                        setPlannedTaskFromDatabase(updatedPlannedTask.plannedTask);
                                    }

                                    Toast.show('task added!', {
                                        duration: Toast.durations.LONG,
                                    });
                                }}
                                style={{
                                    height: 30,
                                    borderRadius: 5,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingRight: 20,
                                }}
                            >
                                <Ionicons name="md-add-circle-outline" size={30} color={'green'} />
                            </TouchableOpacity>

                            <View
                                style={{
                                    height: 30,
                                    borderRadius: 5,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingRight: 10,
                                }}
                            >
                                <Ionicons
                                    name={
                                        isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
                                    }
                                    size={20}
                                    color={colors.secondary_text}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                <Animated.View style={{ height: heightValue }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            paddingLeft: 5,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 12,
                        }}
                    >
                        Select a Habit
                    </Text>
                    <HabitScrollSelector
                        habits={habits}
                        initialHabit={selectedHabit}
                        onHabitSelected={onHabitSelected}
                    />
                </Animated.View>
            </View>
        </View>
    );
};
