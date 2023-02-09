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
import { createTaskModel } from 'src/controller/planning/TaskController';
import { Ionicons } from '@expo/vector-icons';
import { ItemType } from 'react-native-dropdown-picker';
import React from 'react';
import { RandomPlaceHolderTextInput } from 'src/components/common/textbox/RandomPlaceholderTextInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import PlannedTaskController, { createPlannedTaskModel, PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import PlannedDayController, { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { getDurationPretty } from 'src/util/DateUtility';

export const CreateEditOneTimeTask = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<PlanTabScreens, 'CreateEditOneTimeTask'>>();

    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [plannedTask, setPlannedTask] = React.useState<PlannedTaskModel>();
    const [name, setName] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [goalId, setGoalId] = React.useState<string | undefined>();
    const [selectedGoal, setSelectedGoal] = React.useState<GoalModel>();
    const [startTime, setStartTime] = React.useState<Date>(new Date());
    const [duration, setDuration] = React.useState<number>(30);

    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [goalOptions, setGoalOptions] = React.useState<ItemType<string>[]>([]);

    const [durationModalVisible, setDurationModalVisible] = React.useState(false);

    const placeholderOptions = ['Face Care Routine', 'Go For a Run', 'Meditate', 'Read a Book', 'Go For a Walk'];

    const currentUser = useAppSelector(getCurrentUser);

    React.useEffect(() => {
        GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
    }, []);

    React.useEffect(() => {
        if (goals && plannedTask?.goalId) {
            updateSelectedGoalById(plannedTask.goalId);
        }
    }, [goals, plannedTask]);

    React.useEffect(() => {
        const fetch = async () => {
            const plannedDay = await PlannedDayController.getOrCreate(currentUser, route.params.dayKey);
            setPlannedDay(plannedDay);
        };

        fetch();
    }, []);

    React.useEffect(() => {
        const fetch = async () => {
            if (route.params.id && plannedDay?.id) {
                const plannedTask = await PlannedTaskController.get(route.params.id);
                setPlannedTask(plannedTask);
            }
        };

        fetch();
    }, [plannedDay]);

    React.useEffect(() => {
        if (plannedTask?.routine.name) {
            setName(plannedTask.routine.name);
        }

        if (plannedTask?.routine?.description) {
            setDetails(plannedTask.routine.description);
        }

        if (plannedTask?.goalId) {
            setGoalId(plannedTask.goalId);
            updateSelectedGoalById(plannedTask.goalId);
        }

        if (plannedTask?.startMinute) {
            const start = startTime;
            const hours = Math.floor(plannedTask.startMinute / 60);
            const minutes = plannedTask.startMinute - hours * 60;
            start.setHours(hours);
            start.setMinutes(minutes);
            setStartTime(start);
        }

        if (plannedTask?.duration) {
            setDuration(plannedTask.duration);
        }
    }, [plannedTask]);

    React.useEffect(() => {
        let initialItems: any = [
            {
                label: 'Select a Goal',
                value: '',
                labelStyle: { color: colors.secondary_text },
                containerStyle: { marginLeft: 10, marginRight: 10 },
            },
        ];
        goals.forEach((goal) => {
            initialItems.push({ label: goal.name, value: goal.id, containerStyle: { marginLeft: 10, marginRight: 10 } });
        });

        setGoalOptions(initialItems);
    }, [goals]);

    const updateTask = async () => {
        if (!plannedTask) {
            return;
        }

        let clonedPlannedTask: PlannedTaskModel = { ...plannedTask };
        if (goalId !== undefined) {
            clonedPlannedTask.goalId = goalId;
            for (const goal of goals) {
                if (goal.id === goalId && goal.pillarId) {
                    clonedPlannedTask.pillarId = goal.pillarId;
                    break;
                }
            }
        }

        if (name) {
            clonedPlannedTask.routine.name = name;
        }

        if (details) {
            clonedPlannedTask.routine.description = details;
        }

        if (startTime) {
            clonedPlannedTask.startMinute = startTime.getHours() * 60 + startTime.getMinutes();
        }

        if (duration) {
            clonedPlannedTask.duration = duration;
        }

        await PlannedTaskController.update(currentUser, clonedPlannedTask);
        navigation.goBack();
    };

    const createTask = async () => {
        if (!plannedDay?.dayKey) {
            return;
        }

        const task = createTaskModel(name, details, selectedGoal?.id);
        const plannedTask = createPlannedTaskModel(plannedDay.dayKey, task, startTime.getHours() * 60 + startTime.getMinutes(), duration, selectedGoal);

        await PlannedTaskController.create(plannedTask);
        navigation.goBack();
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
                    setStartTime(date);
                    hideCalendar();
                }}
                onCancel={hideCalendar}
                date={startTime}
            />

            <SetDurationModal
                visible={durationModalVisible}
                confirm={(duration: number) => {
                    setDuration(duration);
                    setDurationModalVisible(false);
                }}
                dismiss={() => {
                    setDurationModalVisible(false);
                }}
            />

            <Banner
                name={plannedTask?.id ? 'Edit Task' : 'Create Task'}
                leftText={'Cancel'}
                leftRoute="BACK"
                rightText={'Save'}
                rightOnClick={plannedTask?.id ? updateTask : createTask}
            />
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
                                fontSize: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            Create a one-time to-do item and knock it out!
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
                            Task
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
                                <Text style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}>
                                    {getDurationPretty(duration)}
                                </Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                <Ionicons name="timer-outline" size={24} color={colors.goal_primary_font} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
