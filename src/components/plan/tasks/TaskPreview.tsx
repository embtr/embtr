import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    CARD_SHADOW,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import Toast from 'react-native-root-toast';
import React, { useEffect } from 'react';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { Habit, PlannedDay as PlannedDayModel, PlannedTask, Task, Unit } from 'resources/schema';
import TaskController from 'src/controller/planning/TaskController';
import { Ionicons } from '@expo/vector-icons';
import { HabitScrollSelector } from './HabitScrollSelector';
import { HabitIcon } from '../habit/HabitIcon';
import { TextInput } from 'react-native-gesture-handler';
import { SetUnitModal } from 'src/components/units/SetUnitModal';

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
    const [enteredQuantity, setEnteredQuantity] = React.useState<number>();
    const [selectedUnit, setSelectedUnit] = React.useState<Unit>();
    const [plannedTaskFromDatabase, setPlannedTaskFromDatabase] = React.useState<PlannedTask>();
    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);

    const heightValue = React.useRef(new Animated.Value(0)).current;
    const selectedUnitValue = selectedUnit?.unit
        ? selectedUnit.unit.toString().toLowerCase()
        : 'Of What?';
    const capitalizedUnitValue =
        selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1) + 's';

    useEffect(() => {
        if (task?.taskHabitPreference?.length) {
            setSelectedHabit(task.taskHabitPreference[0].habit!);
        }
    }, []);

    const plannedTaskFromPlannedDay = plannedDay.plannedTasks?.find(
        (plannedTask) => plannedTask.task?.id === task.id
    );

    const plannedTask = plannedTaskFromDatabase || plannedTaskFromPlannedDay;

    const toggleExpand = () => {
        Animated.timing(heightValue, {
            toValue: isExpanded ? 0 : 250, // Set the target height value to 0 or the height you want to expand to
            duration: 100, // Set the duration of the animation
            useNativeDriver: false, // Make sure to set useNativeDriver to false for layout animations
        }).start();

        setIsExpanded(!isExpanded);
    };

    const onHabitSelected = async (habit: Habit) => {
        setSelectedHabit(habit);
        TaskController.updateHabitPreference(task, habit);
    };

    const addButton = (
        <View
            style={{
                paddingRight: 10,
                width: 75,
                alignSelf: 'flex-end',
            }}
        >
            <TouchableOpacity
                onPress={async () => {
                    let taskToAdd = task;

                    if (!task.id) {
                        taskToAdd = await TaskController.createViaApi(task.title!);
                    }

                    const created = await PlannedTaskController.addTaskViaApi(
                        plannedDay,
                        taskToAdd,
                        selectedHabit,
                        selectedUnit,
                        enteredQuantity
                    );
                    setPlannedTaskFromDatabase(created.plannedTask);

                    Toast.show('task added!', {
                        duration: Toast.durations.LONG,
                    });
                }}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'green',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: 'green',
                            marginTop: 4,
                            paddingLeft: 8,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        Add
                    </Text>
                    <View style={{ paddingLeft: 2 }}>
                        <Ionicons name="add" size={20} color={'green'} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <SetUnitModal
                visible={showSetUnitModal}
                confirm={(selected: Unit) => {
                    setShowSetUnitModal(false);
                    setSelectedUnit(selected);
                }}
                dismiss={() => {
                    setShowSetUnitModal(false);
                }}
            />
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

                                {/*
                                 * ADD PLANNED TASK
                                 */}
                                <View style={{ paddingLeft: 10 }}>{!isExpanded && addButton}</View>

                                <View
                                    style={{
                                        height: 30,
                                        borderRadius: 5,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        paddingLeft: 5,
                                        paddingRight: 10,
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            isExpanded
                                                ? 'chevron-up-outline'
                                                : 'chevron-down-outline'
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
                        <View>
                            <HabitScrollSelector
                                habits={habits}
                                initialHabit={selectedHabit}
                                onHabitSelected={onHabitSelected}
                            />
                        </View>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                paddingTop: 5,
                                paddingLeft: 5,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 12,
                            }}
                        >
                            Details
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingTop: 5,
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    flex: 1,
                                    paddingLeft: 10,
                                    flexDirection: 'row',
                                }}
                            >
                                <Text
                                    onPress={() => {
                                        setShowSetUnitModal(true);
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    Quantity
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingRight: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                {isExpanded && (
                                    <TextInput
                                        keyboardType="numeric"
                                        style={{
                                            textAlign: 'right',
                                            borderWidth: 1,
                                            borderColor: colors.secondary_text,
                                            borderRadius: 5,
                                            fontFamily: 'Poppins_400Regular',
                                            color: colors.text,
                                            paddingTop: 6,
                                            paddingBottom: 6,
                                            paddingLeft: 25,
                                            paddingRight: 5,
                                            width: '60%',
                                        }}
                                        placeholder={'how many?'}
                                        placeholderTextColor={colors.secondary_text}
                                        autoCorrect={true}
                                        onChangeText={(text) => {
                                            setEnteredQuantity(parseInt(text));
                                        }}
                                        value={enteredQuantity?.toString()}
                                    />
                                )}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <View
                                style={{
                                    alignItems: 'center',
                                    flex: 1,
                                    paddingLeft: 10,
                                    flexDirection: 'row',
                                }}
                            >
                                <Text
                                    onPress={() => {
                                        setShowSetUnitModal(true);
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    Units
                                </Text>
                            </View>
                            <View
                                style={{
                                    justifyContent: 'flex-end',
                                    flex: 1,
                                    paddingRight: 10,
                                    flexDirection: 'row',
                                }}
                            >
                                {isExpanded && (
                                    <Text
                                        onPress={() => {
                                            setShowSetUnitModal(true);
                                        }}
                                        style={{
                                            textAlign: 'right',
                                            borderWidth: 1,
                                            borderColor: colors.secondary_text,
                                            borderRadius: 5,
                                            fontFamily: 'Poppins_400Regular',
                                            color: selectedUnit
                                                ? colors.text
                                                : colors.secondary_text,
                                            paddingTop: 8,
                                            paddingBottom: 4,
                                            paddingLeft: 25,
                                            paddingRight: 5,
                                            width: '60%',
                                        }}
                                    >
                                        {capitalizedUnitValue}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={{ paddingTop: 10 }}>{isExpanded && addButton}</View>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};
