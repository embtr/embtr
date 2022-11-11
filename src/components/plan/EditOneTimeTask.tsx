import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Keyboard, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TodayTab } from 'src/navigation/RootStackParamList';
import { Banner } from 'src/components/common/Banner';
import { isIosApp } from 'src/util/DeviceUtil';
import { Screen } from 'src/components/common/Screen';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { SetDurationModal } from 'src/components/plan/SetDurationModal';
import PlannedDayController, { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { EmbtrDropDownSelect } from 'src/components/common/dropdown/EmbtrDropDownSelect';
import { StackNavigationProp } from '@react-navigation/stack';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';

export const EditOneTimeTask = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<TodayTab, 'EditOneTimeTask'>>();

    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [plannedTask, setPlannedTask] = React.useState<PlannedTaskModel>();

    const [name, setName] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [goals, setGoals] = React.useState<GoalModel[]>([]);
    const [setSelectedGoal] = React.useState();
    const [goalOptions, setGoalOptions] = React.useState([{ label: '', value: '' }]);
    const [startTime, setStartTime] = React.useState<Date>(Timestamp.now().toDate());
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);
    const [durationModalVisible, setDurationModalVisible] = React.useState(false);
    const [duration, setDuration] = React.useState<number>();

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                PlannedDayController.get(uid, route.params.dayKey, (plannedDay: PlannedDay) => {
                    setPlannedDay(plannedDay);
                });
            }
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                PlannedTaskController.get(uid, route.params.dayKey, route.params.plannedTaskId, (plannedTask: PlannedTaskModel) => {
                    setName(plannedTask.routine.name);
                    setDetails(plannedTask.routine.description);

                    goals.forEach((goal) => {
                        if (goal.id === plannedTask.routine.goalId) {
                            //set goal
                        }
                    });

                    if (plannedTask.startMinute) {
                        setStartTime(toDateTime(plannedTask.startMinute));
                    }

                    if (plannedTask.duration) {
                        setDuration(plannedTask.duration);
                    }

                    setPlannedTask(plannedTask);
                });
            }
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            let initialItems: any = [];
            goals.forEach((goal) => {
                initialItems.push({ label: goal.name, value: goal.id, containerStyle: { marginLeft: 10, marginRight: 10 } });
            });

            setGoalOptions(initialItems);
        }, [goals])
    );

    function toDateTime(secs: number) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setHours(Math.floor(secs / 60));
        t.setMinutes(Math.floor(secs % 60));
        return t;
    }

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

    const saveTask = () => {
        if (plannedDay && plannedTask) {
            plannedTask.routine.name = name;
            plannedTask.routine.description = details;
            plannedTask.startMinute = startTime.getHours() * 60 + startTime.getMinutes();
            plannedTask.duration = duration;
            PlannedTaskController.updateTask(plannedDay, plannedTask, () => {
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

            <Banner name="Edit Task" leftText={'Cancel'} leftRoute="BACK" rightText={'Save'} rightOnClick={saveTask} />
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
                            A task should help you make progess towards achieving your goals.
                        </Text>
                    </View>

                    {/* Name */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                        >
                            Task
                        </Text>
                        <TextInput
                            style={{
                                padding: 15,
                                fontFamily: 'Poppins_400Regular',
                                color: colors.text,
                                borderRadius: 12,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                width: '95%',
                            }}
                            placeholder={'Enter your task'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setName}
                            //onChange={() => { setTitleError(false) }}
                            value={name}
                            autoCorrect={true}
                        />
                    </View>

                    {/* Description */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
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
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                        >
                            Goal
                        </Text>
                        <EmbtrDropDownSelect items={goalOptions} onItemSelected={setSelectedGoal} name={'Goal'} />
                    </View>

                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                        >
                            Start Time
                        </Text>

                        <View
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
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text onPress={showCalendar} style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}>
                                    {format(startTime, 'h:mm a')}
                                </Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                <Ionicons name="time-outline" size={24} color={colors.goal_primary_font} onPress={showCalendar} />
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.goal_primary_font, paddingLeft: 5, width: '95%', paddingBottom: 10, fontFamily: 'Poppins_400Regular' }}
                        >
                            Duration
                        </Text>

                        <View
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
                        >
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text
                                    onPress={() => {
                                        setDurationModalVisible(true);
                                    }}
                                    style={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 16 }}
                                >
                                    {duration} minutes
                                </Text>
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, justifyContent: 'center' }}>
                                <Ionicons
                                    name="timer-outline"
                                    size={24}
                                    color={colors.goal_primary_font}
                                    onPress={() => {
                                        setDurationModalVisible(true);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
