import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';
import { ScrollView } from 'react-native-gesture-handler';
import { POPPINS_REGULAR } from 'src/util/constants';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';

interface Props {
    visible: boolean;
    plannedDay: PlannedDay;
    confirm: Function;
    dismiss: Function;
}

export const AddHabitModal = ({ visible, plannedDay, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [selectedTasks, setSelectedTasks] = React.useState<string[]>([]);
    const [habits, setHabits] = React.useState<TaskModel[]>([]);

    React.useEffect(() => {
        const uid = getAuth().currentUser?.uid;
        if (uid) {
            TaskController.getTasks(uid, (habits: TaskModel[]) => {
                if (habits.length > 0) {
                    setHabits(habits);
                }
            });
        }
    }, []);

    const taskSelected = (taskId: string, isSelected: boolean) => {
        let newSelectedTasks: string[] = [];
        selectedTasks.forEach((selectedTask) => {
            if (selectedTask !== taskId) {
                newSelectedTasks.push(selectedTask);
            }
        });

        if (!isSelected) {
            newSelectedTasks.push(taskId);
        }

        setSelectedTasks(newSelectedTasks);
    };

    let habitViews: JSX.Element[] = [];
    habits.forEach((habit) => {
        const isSelected: boolean = habit.id !== undefined && selectedTasks.includes(habit.id);

        habitViews.push(
            <TouchableOpacity
                style={{ width: '100%' }}
                onPress={() => {
                    taskSelected(habit.id!, isSelected);
                }}
            >
                <View key={habit.id} style={{ height: 40, justifyContent: 'center', width: '100%', paddingLeft: 10 }}>
                    <View>
                        <Text style={{ color: isSelected ? colors.text : 'gray', fontFamily: POPPINS_REGULAR }}>{habit.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const getTasksFromIds = (ids: string[]): TaskModel[] => {
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
        setSelectedTasks([]);
        dismiss();
    };

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
                                    <Text style={{ fontSize: 16, fontFamily: 'Poppins_500Medium', color: colors.text }}>Select Your Tasks</Text>
                                </View>

                                <HorizontalLine />
                                <ScrollView>
                                    <View style={{ alignItems: 'center' }}>{habitViews}</View>
                                </ScrollView>
                                <HorizontalLine />

                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                    <Button
                                        title="Add Habits"
                                        onPress={() => {
                                            const tasks = getTasksFromIds(selectedTasks);
                                            confirm(tasks);
                                            closeModal();
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 8 }} />

                            <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                <Button
                                    title="Create Task"
                                    onPress={() => {
                                        closeModal();
                                        navigation.navigate('CreateOneTimeTask', { dayKey: plannedDay.id! });
                                    }}
                                />
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
