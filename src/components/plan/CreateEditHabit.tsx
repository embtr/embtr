import React from 'react';
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
import { EmbtrDropDownSelect } from 'src/components/common/dropdown/EmbtrDropDownSelect';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskController, { FAKE_HABIT, TaskModel } from 'src/controller/planning/TaskController';
import { POPPINS_REGULAR_ITALIC, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { RandomPlaceHolderTextInput } from '../common/textbox/RandomPlaceholderTextInput';
import { ItemType } from 'react-native-dropdown-picker';

export const CreateEditHabit = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateEditHabit'>>();

    const [habit, setHabit] = React.useState<TaskModel>();
    const [name, setName] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [goalId, setGoalId] = React.useState('');
    const [selectedGoal, setSelectedGoal] = React.useState<GoalModel>();

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [goalOptions, setGoalOptions] = React.useState<ItemType<string>[]>([]);

    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);
    const [durationModalVisible, setDurationModalVisible] = React.useState(false);

    const placeholderOptions = ['Face Care Routine', 'Go For a Run', 'Meditate', 'Read a Book', 'Go For a Walk'];

    React.useEffect(() => {
        if (route.params.id) {
            TaskController.getHabit(route.params.id, setHabit);
        } else {
            setHabit(FAKE_HABIT);
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
            updateSelectedGoalById(habit.goalId);
        }
    }, [goals, habit]);

    React.useEffect(() => {
        let initialItems: any = [
            {
                label: 'Select a Goal',
                value: '',
                selectedItemLabelStyle: { color: 'blue' },
                labelStyle: { color: colors.secondary_text },
                containerStyle: { marginLeft: 10, marginRight: 10 },
            },
        ];
        goals.forEach((goal) => {
            initialItems.push({ label: goal.name, value: goal.id, containerStyle: { marginLeft: 10, marginRight: 10 } });
        });

        setGoalOptions(initialItems);
    }, [goals]);

    const save = async () => {
        if (!habit) {
            return;
        }

        const clone: TaskModel = { ...habit };
        clone.name = name;
        clone.description = details;
        clone.goalId = goalId;
        if (clone.id) {
            await TaskController.update(clone);
            navigation.goBack();
        } else {
            TaskController.createTask(clone, () => {
                navigation.goBack();
            });
        }
    };

    const showCalendar = () => {
        setCalendarVisible(true);
    };

    const hideCalendar = () => {
        setCalendarVisible(false);
    };

    const updateSelectedGoalFromObject = (goalOption: ItemType<string>) => {
        if (goalOption.value) {
            updateSelectedGoalById(goalOption.value);
        } else {
            setGoalId('');
            setSelectedGoal(undefined);
        }
    };

    const updateSelectedGoalById = (goalId: string) => {
        setGoalId(goalId);
        goals.forEach((goal) => {
            if (goal.id === goalId) {
                setSelectedGoal(goal);
                return;
            }
        });
    };

    const initialGoalItem: ItemType<string> = {
        label: selectedGoal?.name ? selectedGoal?.name : 'Select a Goal',
        value: selectedGoal?.id ? selectedGoal.id : '',
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

            <Banner name={habit?.id ? 'Edit Habit' : 'Create Habit'} leftText={'cancel'} leftRoute="BACK" rightText={'save'} rightOnClick={save} />
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
