import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { ScrollView } from 'react-native-gesture-handler';
import { POPPINS_REGULAR } from 'src/util/constants';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

interface Props {}

export const MultiSelectHabits = ({}: Props) => {
    const { colors } = useTheme();

    const [selectedHabits, setSelectedHabits] = React.useState<string[]>([]);
    const [habits, setHabits] = React.useState<TaskModel[]>([]);

    React.useEffect(() => {
        TaskController.getTasks(getCurrentUid(), setHabits);
    }, []);

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

    const getHabitsFromIds = (ids: string[]): TaskModel[] => {
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

    return (
        <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={true}>
            <View>{habitViews}</View>
        </ScrollView>
    );
};
