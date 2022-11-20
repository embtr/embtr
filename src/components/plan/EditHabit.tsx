import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Keyboard, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PlanTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { isIosApp } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getAuth } from 'firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SetDurationModal } from 'src/components/plan/SetDurationModal';
import { DropDownOption, EmbtrDropDownSelect } from 'src/components/common/dropdown/EmbtrDropDownSelect';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskController, { EMPTY_HABIT, TaskModel } from 'src/controller/planning/TaskController';
import { POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { RandomPlaceHolderTextInput } from '../common/textbox/RandomPlaceholderTextInput';

export const EditHabit = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'EditHabit'>>();

    const [habit, setHabit] = React.useState<TaskModel>();
    const [name, setName] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [goalId, setGoalId] = React.useState('');
    const [selectedGoal, setSelectedGoal] = React.useState<GoalModel>();

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [goalOptions, setGoalOptions] = React.useState<DropDownOption[]>([]);
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);
    const [durationModalVisible, setDurationModalVisible] = React.useState(false);

    const placeholderOptions = ['Face Care Routine', 'Go For a Run', 'Meditate', 'Read a Book', 'Go For a Walk'];

    React.useEffect(() => {
        if (route.params.id) {
            TaskController.getTask(route.params.id, setHabit);
        } else {
            setHabit(EMPTY_HABIT);
        }
    }, []);

    React.useEffect(() => {
        if (habit?.name) {
            setName(habit.name);
        }

        if (habit?.description) {
            setDetails(habit.description);
        }

        if (habit?.goalId) {
            setGoalId(habit.goalId);
        }
    }, [habit]);

    React.useEffect(() => {
        GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
    }, []);

    React.useEffect(() => {
        if (goals && habit?.goalId) {
            updateSelectedGoal(habit.goalId);
        }
    }, [goals, habit]);

    React.useEffect(() => {
        let initialItems: any = [];
        goals.forEach((goal) => {
            initialItems.push({ label: goal.name, value: goal.id, containerStyle: { marginLeft: 10, marginRight: 10 } });
        });

        setGoalOptions(initialItems);
    }, [goals]);

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item key={'hour_' + i} color={colors.text} label={'' + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        minutePickerItems.push(<Picker.Item key={'minute_' + i} color={colors.text} label={(i < 10 ? '0' : '') + i} value={i} />);
    }

    let durationHoursPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        durationHoursPickerItems.push(<Picker.Item key={'durationhour_' + i} color={colors.text} label={'' + i} value={i} />);
    }

    let durationMinutesPickerItems: JSX.Element[] = [];
    for (let i = 0; i < 60; i += 5) {
        durationMinutesPickerItems.push(<Picker.Item key={'durationminute_' + i} color={colors.text} label={'' + i} value={i} />);
    }

    const saveTask = async () => {
        if (!habit) {
            return;
        }

        const clone = TaskController.clone(habit);
        clone.name = name;
        clone.description = details;
        clone.goalId = goalId;

        await TaskController.update(clone);
        navigation.goBack();
    };

    const showCalendar = () => {
        setCalendarVisible(true);
    };

    const hideCalendar = () => {
        setCalendarVisible(false);
    };

    const updateSelectedGoalFromObject = (goalOption: DropDownOption) => {
        updateSelectedGoal(goalOption.value);
    };

    const updateSelectedGoal = (goalId: string) => {
        setGoalId(goalId);
        goals.forEach((goal) => {
            if (goal.id === goalId) {
                setSelectedGoal(goal);
                return;
            }
        });
    };

    const initialGoalItem: DropDownOption = {
        label: selectedGoal?.name ? selectedGoal?.name : 'lol',
        value: selectedGoal?.id ? selectedGoal.id : 'lol',
    };

    return (
        <Screen>
            <DateTimePickerModal
                isVisible={calendarVisible}
                mode="time"
                onConfirm={(date) => {
                    //setStartTime(date);
                    hideCalendar();
                }}
                onCancel={hideCalendar}
                //date={startTime}
            />

            <SetDurationModal
                visible={durationModalVisible}
                confirm={(duration: number) => {
                    // setDuration(duration);
                    setDurationModalVisible(false);
                }}
                dismiss={() => {
                    setDurationModalVisible(false);
                }}
            />

            <Banner name="Edit Habit" leftText={'Cancel'} leftRoute="BACK" rightText={'Save'} rightOnClick={saveTask} />
            <ScrollView scrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <View style={{ paddingTop: 5 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 17, paddingTop: 10, paddingLeft: 15 }}
                        >
                            Achieve your goals!
                        </Text>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 11,
                                paddingLeft: 25,
                                paddingRight: 25,
                            }}
                        >
                            define{'  '}
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    fontFamily: POPPINS_REGULAR_ITALIC,
                                }}
                            >
                                /ˈhabət/ n.{'  '}
                            </Text>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    fontFamily: POPPINS_SEMI_BOLD,
                                }}
                            >
                                1.{' '}
                            </Text>
                            a settled or regular tendency or practice, especially one that is hard to give up.
                        </Text>

                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            Create a habit that pushes you to be the best version of you!
                        </Text>
                    </View>

                    {/* Name */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Habit
                        </Text>
                        <RandomPlaceHolderTextInput value={name} onChangeValue={setName} placeholderOptions={placeholderOptions} />
                    </View>

                    {/* Description */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Details
                        </Text>
                        <TextInput
                            textAlignVertical="top"
                            style={{
                                width: '95%',
                                fontFamily: 'Poppins_400Regular',
                                height: 200,
                                borderRadius: 12,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                color: colors.text,
                                paddingTop: 10,
                                paddingLeft: 10,
                                paddingRight: 10,
                            }}
                            multiline={true}
                            placeholder={'What are the details of this task?'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setDetails}
                            //onChange={() => { setStoryError(false) }}
                            value={details}
                            autoCorrect={true}
                        />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Goal
                        </Text>
                        <EmbtrDropDownSelect items={goalOptions} onItemSelected={updateSelectedGoalFromObject} initial={initialGoalItem} name={'Goal'} />
                    </View>

                    {/*
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Start Time
                        </Text>

                        <TouchableOpacity
                            style={{
                                height: 50,
                                width: '95%',
                                borderRadius: 12,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                backgroundColor: colors.text_input_background,
                                justifyContent: 'center',
                                paddingLeft: 15,
                                flexDirection: 'row',
                            }}
                            onPress={showCalendar}
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}>
                                    {format(startTime, 'h:mm a')}
                                </Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                <Ionicons name="time-outline" size={24} color={colors.goal_primary_font} />
                            </View>
                        </TouchableOpacity>
                    </View>

*/}
                    {/*
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 5, fontFamily: 'Poppins_400Regular' }}
                        >
                            Duration
                        </Text>

                        <TouchableOpacity
                            style={{
                                height: 50,
                                width: '95%',
                                borderRadius: 12,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                backgroundColor: colors.text_input_background,
                                justifyContent: 'center',
                                paddingLeft: 15,
                                flexDirection: 'row',
                            }}
                            onPress={() => {
                                setDurationModalVisible(true);
                            }}
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}>{duration} minutes</Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                <Ionicons name="timer-outline" size={24} color={colors.goal_primary_font} />
                            </View>
                        </TouchableOpacity>
                    </View>
*/}
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
