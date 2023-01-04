import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { ScrollView } from 'react-native-gesture-handler';
import { POPPINS_REGULAR } from 'src/util/constants';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import RoutineController, { RoutineModel } from 'src/controller/routine/RoutineController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import RoutineHabitController, { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';

interface Props {
    visible: boolean;
    plannedDay?: PlannedDay;
    confirm: Function;
    dismiss: Function;
}

const enum SelectOption {
    HABIT,
    ROUTINE,
}

export const AddHabitModal = ({ visible, plannedDay, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [selectedRoutines, setSelectedRoutines] = React.useState<string[]>([]);
    const [selectedHabits, setSelectedHabits] = React.useState<string[]>([]);
    const [habits, setHabits] = React.useState<TaskModel[]>([]);
    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);
    const [selectOption, setSelectOption] = React.useState<SelectOption>(SelectOption.HABIT);

    React.useEffect(() => {
        TaskController.getTasks(getCurrentUid(), setHabits);
    }, [visible]);

    const currentUser = useAppSelector(getCurrentUser);

    React.useEffect(() => {
        const fetch = async () => {
            const routines = await RoutineController.getAll(currentUser);
            setRoutines(routines);
        };

        fetch();
    }, [visible]);

    const routineSelected = (routineId: string, isSelected: boolean) => {
        let newSelectedRoutines: string[] = [];
        selectedRoutines.forEach((selectedRoutine) => {
            if (selectedRoutine !== routineId) {
                newSelectedRoutines.push(selectedRoutine);
            }
        });

        if (!isSelected) {
            newSelectedRoutines.push(routineId);
        }

        setSelectedRoutines(newSelectedRoutines);
    };

    const habitSelected = (habitId: string, isSelected: boolean) => {
        let newSelectedHabits: string[] = [];
        selectedHabits.forEach((selectedHabit) => {
            if (selectedHabit !== habitId) {
                newSelectedHabits.push(selectedHabit);
            }
        });

        if (!isSelected) {
            newSelectedHabits.push(habitId);
        }

        setSelectedHabits(newSelectedHabits);
    };

    let routineViews: JSX.Element[] = [];
    routines.forEach((routine) => {
        const isSelected: boolean = routine.id !== undefined && selectedRoutines.includes(routine.id);

        routineViews.push(
            <TouchableOpacity
                key={routine.id}
                style={{ width: '100%' }}
                onPress={() => {
                    routineSelected(routine.id!, isSelected);
                }}
            >
                <View style={{ height: 40, justifyContent: 'center', width: '100%', paddingLeft: 10 }}>
                    <View>
                        <Text style={{ color: isSelected ? colors.text : 'gray', fontFamily: POPPINS_REGULAR }}>{routine.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    let habitViews: JSX.Element[] = [];
    habits.forEach((habit) => {
        const isSelected: boolean = habit.id !== undefined && selectedHabits.includes(habit.id);

        habitViews.push(
            <TouchableOpacity
                key={habit.id}
                style={{ width: '100%' }}
                onPress={() => {
                    habitSelected(habit.id!, isSelected);
                }}
            >
                <View style={{ height: 40, justifyContent: 'center', width: '100%', paddingLeft: 10 }}>
                    <View>
                        <Text style={{ color: isSelected ? colors.text : 'gray', fontFamily: POPPINS_REGULAR }}>{habit.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const getRoutineHabitsFromRoutineIds = async (ids: string[]): Promise<RoutineHabitModel[]> => {
        let allRoutineHabits: RoutineHabitModel[] = [];

        for (const id of ids) {
            for (const routine of routines) {
                if (routine.id === id) {
                    const routineHabits = await RoutineHabitController.getAllInRoutine(routine);
                    allRoutineHabits = allRoutineHabits.concat(routineHabits);
                    break;
                }
            }
        }

        return allRoutineHabits;
    };

    const getHabitsFromHabitIds = (ids: string[]): TaskModel[] => {
        let tasks: TaskModel[] = [];

        for (const id of ids) {
            for (const habit of habits) {
                if (habit.id === id) {
                    tasks.push(habit);
                    continue;
                }
            }
        }

        return tasks;
    };

    const closeModal = () => {
        setSelectedHabits([]);
        setSelectedRoutines([]);
        dismiss();
    };

    const toggleSelectOption = () => {
        let nextOption = SelectOption.HABIT;
        if (selectOption === SelectOption.HABIT) {
            nextOption = SelectOption.ROUTINE;
        }

        setSelectOption(nextOption);
    };

    const selectOptionText = selectOption === SelectOption.HABIT ? 'Habits' : 'Routines';

    return (
        <View>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <View style={{ position: 'absolute', zIndex: 1, height: '100%', width: '100%', backgroundColor: 'rgba(000,000,000,.6)' }}>
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            closeModal();
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            style={{ flex: 1, width: '100%' }}
                            onPress={() => {
                                closeModal();
                            }}
                        />
                        <View>
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: 'space-around' }}>
                                <View
                                    style={{
                                        backgroundColor: colors.modal_background,
                                        borderRadius: 12,
                                        paddingTop: 12.5,
                                        paddingBottom: 12.5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins_500Medium', color: colors.text, textAlign: 'right' }}>
                                            Select Your{' '}
                                        </Text>
                                        <Text
                                            onPress={toggleSelectOption}
                                            style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins_500Medium', color: colors.link }}
                                        >
                                            {' '}
                                            {selectOptionText}
                                        </Text>
                                    </View>
                                </View>

                                <HorizontalLine />
                                <ScrollView style={{ height: '40%' }} showsVerticalScrollIndicator={true}>
                                    <View style={{ alignItems: 'center' }}>{selectOption === SelectOption.HABIT ? habitViews : routineViews}</View>
                                </ScrollView>
                                <HorizontalLine />

                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                    <Button
                                        title="Add All"
                                        onPress={async () => {
                                            const habits = getHabitsFromHabitIds(selectedHabits);
                                            const routineHabits = await getRoutineHabitsFromRoutineIds(selectedRoutines);
                                            confirm(habits, routineHabits);
                                            closeModal();
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 8 }} />

                            <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                <Button
                                    title="Create Habit"
                                    onPress={() => {
                                        closeModal();
                                        navigation.navigate('CreateEditHabit', { id: undefined });
                                    }}
                                />
                                {plannedDay && (
                                    <View>
                                        <HorizontalLine />
                                        <Button
                                            title="Create One Time Task"
                                            onPress={() => {
                                                closeModal();
                                                navigation.navigate('CreateEditOneTimeTask', { dayKey: plannedDay.dayKey });
                                            }}
                                        />
                                    </View>
                                )}
                                <HorizontalLine />
                                <Button
                                    title="Cancel"
                                    onPress={() => {
                                        closeModal();
                                    }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1, width: '100%' }}
                            onPress={() => {
                                closeModal();
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            closeModal();
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};
