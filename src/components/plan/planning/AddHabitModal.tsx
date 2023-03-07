import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { TextInput } from 'react-native-gesture-handler';
import { POPPINS_REGULAR } from 'src/util/constants';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { Tasks } from '../tasks/Tasks';
import { Screen } from 'src/components/common/Screen';
import SafeAreaView from 'react-native-safe-area-view';
import { Banner } from 'src/components/common/Banner';

interface Props {
    visible: boolean;
    plannedDay?: PlannedDay;
    confirm: Function;
    dismiss: Function;
}

export const AddHabitModal = ({ visible, plannedDay, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const [selectedRoutines, setSelectedRoutines] = React.useState<string[]>([]);
    const [selectedHabits, setSelectedHabits] = React.useState<string[]>([]);
    const [habits, setHabits] = React.useState<TaskModel[]>([]);

    React.useEffect(() => {
        TaskController.getTasks(getCurrentUid(), setHabits);
    }, [visible]);

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
                        <Text style={{ color: isSelected ? colors.tab_selected : 'gray', fontFamily: POPPINS_REGULAR }}>{habit.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const closeModal = () => {
        setSelectedHabits([]);
        setSelectedRoutines([]);
        dismiss();
    };

    return (
        <Modal visible={visible} animationType={'slide'}>
            <Screen>
                <SafeAreaView forceInset={{ bottom: 'never' }}>
                    <Banner name="Add Tasks" leftText="close" leftOnClick={closeModal} />
                    <Tasks />
                </SafeAreaView>
            </Screen>
        </Modal>
    );
};
