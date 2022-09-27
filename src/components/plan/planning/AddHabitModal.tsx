import * as React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import TaskController, { TaskModel } from 'src/controller/planning/TaskController';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';


interface Props {
    visible: boolean,
    dayKey: string,
    confirm: Function,
    dismiss: Function
}

export const AddHabitModal = ({ visible, dayKey, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();

    const [habits, setHabits] = React.useState<TaskModel[]>([]);
    const [selectedHabit, setSelectedHabit] = React.useState<TaskModel | undefined>(undefined);

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

    let hourPickerItems: JSX.Element[] = [];
    habits.forEach(habit => {
        hourPickerItems.push(<Picker.Item key={habit.id} color={colors.text} label={habit.name} value={habit.id!} />);
    });

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    const s = (habitId: string) => {
        habits.forEach(habit => {
            if (habitId === habit.id) {
                setSelectedHabit(habit);
                return;
            }
        });
    };

    return (
        <View>
            <Modal visible={visible} transparent={true} animationType={"fade"} >
                <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", backgroundColor: "rgba(000,000,000,.6)" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                        <View>
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: "space-around" }}>
                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 12.5, paddingBottom: 12.5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 16, fontFamily: "Poppins_500Medium", color: colors.text }}>Select A Task</Text>
                                </View>
                                <HorizontalLine />
                                <View style={{ alignItems: "center" }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Picker
                                            style={{ width: 275, color: colors.text }}
                                            selectedValue={selectedHabit?.id}
                                            onValueChange={s}>
                                            {hourPickerItems}
                                        </Picker>
                                    </View>
                                </View>

                                <HorizontalLine />

                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                    <Button title='Add Habit' onPress={() => { confirm(selectedHabit) }} />
                                </View>
                            </View>

                            <View style={{ height: 5 }} />

                            <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                <Button title='Create Task' onPress={() => { dismiss(); navigation.navigate('CreateOneTimeTask', { dayKey: dayKey }) }} />
                            </View>

                        </View>
                        <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
            </Modal>
        </View>
    )
}
