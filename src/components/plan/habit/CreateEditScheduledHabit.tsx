import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Text, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitController, HabitCustomHooks } from 'src/controller/habit/HabitController';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import {
    DayOfTheWeek,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    TIMELINE_CARD_PADDING,
    TimeOfDay,
} from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { View, Switch, Animated, Easing } from 'react-native';
import { HabitQuantityInput } from './HabitQuantityInput';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import { CreateScheduledHabitRequest } from 'resources/types/requests/ScheduledHabitTypes';
import { DaysOfTheWeekToggle } from './DaysOfTheWeekToggle';
import { TimesOfDayToggle } from './TimesOfDayToggle';
import { HabitUnitPicker } from './HabitUnitPicker';
import { Unit } from 'resources/schema';
import { StackNavigationProp } from '@react-navigation/stack';
import { DatePicker } from 'src/components/common/date/DatePicker';
import { formatDate } from 'src/util/DateUtility';
import { HabitDatePicker } from './HabitDatePicker';

export const CreateEditScheduledHabit = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();

    const habitId = route.params.habitId;
    const habit = HabitCustomHooks.useHabit(Number(habitId));

    React.useEffect(() => {
        if (habit) {
            setTitle(habit.title ?? '');
        }
    }, [habit]);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [repeatingScheduleEnabled, setRepeatingScheduleEnabled] = React.useState(false);
    const [repeatingScheduleViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const [timeOfDayEnabled, setTimeOfDayEnabled] = React.useState(false);
    const [timeOfDayViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const [detailsEnabled, setDetailsEnabled] = React.useState(false);
    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfTheWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);

    const [quantity, setQuantity] = React.useState('0');
    const [unit, setUnit] = React.useState<Unit>();

    const [startDateDatePickerModalVisible, setStartDateDatePickerModalVisible] =
        React.useState(false);
    const [endDateDatePickerModalVisible, setEndDateDatePickerModalVisible] = React.useState(false);
    const [startDate, setStartDate] = React.useState<Date>(new Date());
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const toggleVisibility = (
        enabled: boolean,
        setEnabled: Function,
        viewHeight: Animated.Value,
        maxHeight: number = 50
    ) => {
        setEnabled(!enabled);
        const height = enabled ? 0 : maxHeight;

        Animated.timing(viewHeight, {
            toValue: height, // Set the desired height
            duration: 125, // Adjust the duration as needed
            easing: Easing.ease, // Adjust the easing function as needed
            useNativeDriver: false, // Make sure to set this to false for height animation
        }).start();
    };

    const startDatePretty = formatDate(startDate);
    const endDatePretty = formatDate(endDate);

    const startDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={startDateDatePickerModalVisible}
                date={startDate}
                onConfirm={(date: Date) => {
                    setStartDateDatePickerModalVisible(false);
                    setStartDate(date);
                }}
                onCancel={() => {
                    setStartDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [startDateDatePickerModalVisible]);

    const endDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={endDateDatePickerModalVisible}
                date={endDate}
                onConfirm={(date: Date) => {
                    setEndDateDatePickerModalVisible(false);
                    setEndDate(date);
                }}
                onCancel={() => {
                    setEndDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [endDateDatePickerModalVisible]);

    //todo - implement me
    //const scheduledHabitId = route.params.scheduledHabitId;
    return (
        <Screen>
            <Banner name={'Schedule Habit'} leftRoute="BACK" leftIcon={'arrow-back'} />
            {startDateDatePickerMemo}
            {endDateDatePickerMemo}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: TIMELINE_CARD_PADDING,
                    }}
                >
                    {/* HABIT */}
                    <View style={{ paddingTop: TIMELINE_CARD_PADDING }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                }}
                            >
                                Habit
                            </Text>

                            {title.length < 1 && (
                                <Text
                                    onPress={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={{
                                        alignSelf: 'flex-end',
                                        color: colors.tab_selected,
                                        paddingLeft: 5,
                                        paddingBottom: 3,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    cannot be blank
                                </Text>
                            )}
                        </View>
                        <View
                            style={{ paddingTop: TIMELINE_CARD_PADDING / 4, flexDirection: 'row' }}
                        >
                            <View
                                style={{
                                    height: 50,
                                    width: 50,

                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <SvgUri width={37.5} height={37.5} uri={habit?.iconUrl ?? ''} />
                            </View>
                            <View style={{ width: TIMELINE_CARD_PADDING }} />
                            <TextInput
                                style={{
                                    height: 50,
                                    padding: TIMELINE_CARD_PADDING,
                                    flex: 1,
                                    color: colors.text,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                                placeholder={'Give your habit a title'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setTitle}
                                value={title}
                            />
                        </View>
                    </View>

                    {/* DESCRIPTION */}
                    <View
                        style={{
                            paddingTop: TIMELINE_CARD_PADDING * 2,
                        }}
                    >
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            Description
                        </Text>

                        <View style={{ paddingTop: TIMELINE_CARD_PADDING / 4 }}>
                            <TextInput
                                textAlignVertical="top"
                                style={{
                                    height: 150,
                                    borderRadius: 12,
                                    padding: TIMELINE_CARD_PADDING,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    color: colors.text,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                                multiline={true}
                                placeholder={'Enter some specifics about this habit.'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDescription}
                                value={description}
                            />
                        </View>
                    </View>

                    {/* Repeating Schedule */}
                    <View>
                        <View
                            style={{
                                paddingTop: TIMELINE_CARD_PADDING * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    onPress={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_MEDIUM,
                                        fontSize: 16,
                                    }}
                                >
                                    Repeating Schedule
                                </Text>
                            </View>

                            <View style={{}}>
                                <Switch
                                    onValueChange={() => {
                                        toggleVisibility(
                                            repeatingScheduleEnabled,
                                            setRepeatingScheduleEnabled,
                                            repeatingScheduleViewHeight,
                                            150 + TIMELINE_CARD_PADDING * 2
                                        );
                                    }}
                                    value={repeatingScheduleEnabled}
                                    style={isAndroidDevice() ? { height: 20 } : {}}
                                    trackColor={{
                                        false: colors.secondary_text,
                                        true: colors.accent_color,
                                    }}
                                    thumbColor={colors.toggle}
                                    ios_backgroundColor={colors.toggle_background_unselected}
                                />
                            </View>
                        </View>

                        <Animated.View
                            style={{
                                marginTop: TIMELINE_CARD_PADDING,
                                height: repeatingScheduleViewHeight,
                                overflow: 'hidden',
                            }}
                        >
                            <DaysOfTheWeekToggle
                                onDaysChanged={setDaysOfWeek}
                            />

                            <View style={{ width: '100%'}}>
                                <HabitDatePicker
                                    dateType="Start Date"
                                    prettyDate={startDatePretty}
                                    onPress={() => {
                                        setStartDateDatePickerModalVisible(true);
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    width: '100%',
                                    paddingTop: TIMELINE_CARD_PADDING,
                                }}
                            >
                                <HabitDatePicker
                                    dateType="End Date"
                                    prettyDate={endDatePretty}
                                    onPress={() => {
                                        setEndDateDatePickerModalVisible(true);
                                    }}
                                />
                            </View>
                        </Animated.View>
                    </View>

                    {/* Time Of Day */}
                    <View>
                        <View
                            style={{
                                paddingTop: TIMELINE_CARD_PADDING * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    onPress={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_MEDIUM,
                                        fontSize: 16,
                                    }}
                                >
                                    Time Of Day
                                </Text>
                            </View>

                            <View style={{}}>
                                <Switch
                                    onValueChange={() => {
                                        toggleVisibility(
                                            timeOfDayEnabled,
                                            setTimeOfDayEnabled,
                                            timeOfDayViewHeight
                                        );
                                    }}
                                    value={timeOfDayEnabled}
                                    style={isAndroidDevice() ? { height: 20 } : {}}
                                    trackColor={{
                                        false: colors.secondary_text,
                                        true: colors.accent_color,
                                    }}
                                    thumbColor={colors.toggle}
                                    ios_backgroundColor={colors.toggle_background_unselected}
                                />
                            </View>
                        </View>

                        <Animated.View
                            style={{
                                marginTop: TIMELINE_CARD_PADDING,
                                flexDirection: 'row',
                                height: timeOfDayViewHeight,
                                overflow: 'hidden',
                            }}
                        >
                            <TimesOfDayToggle onTimesChanged={setTimesOfDay} />
                        </Animated.View>
                    </View>

                    {/* Details */}
                    <View>
                        <View
                            style={{
                                paddingTop: TIMELINE_CARD_PADDING * 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    onPress={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_MEDIUM,
                                        fontSize: 16,
                                    }}
                                >
                                    Details
                                </Text>
                            </View>

                            <View style={{}}>
                                <Switch
                                    onValueChange={() => {
                                        toggleVisibility(
                                            detailsEnabled,
                                            setDetailsEnabled,
                                            detailsViewHeight,
                                            100 + TIMELINE_CARD_PADDING
                                        );
                                    }}
                                    value={detailsEnabled}
                                    style={isAndroidDevice() ? { height: 20 } : {}}
                                    trackColor={{
                                        false: colors.secondary_text,
                                        true: colors.accent_color,
                                    }}
                                    thumbColor={colors.toggle}
                                    ios_backgroundColor={colors.toggle_background_unselected}
                                />
                            </View>
                        </View>

                        <Animated.View
                            style={{
                                marginTop: TIMELINE_CARD_PADDING,
                                height: detailsViewHeight,
                                overflow: 'hidden',
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <HabitQuantityInput value={quantity} setValue={setQuantity} />
                            </View>

                            <View style={{ flex: 1, paddingTop: TIMELINE_CARD_PADDING }}>
                                <HabitUnitPicker detailName={'Of What?'} onUnitChanged={() => {}} />
                            </View>
                        </Animated.View>
                    </View>
                    <View style={{ height: TIMELINE_CARD_PADDING}} />
                </View>
            </ScrollView>

            {/* SAVE BUTTON */}
            <View style={{ backgroundColor: colors.tab_bar_menu, width: '100%', height: 50 }}>
                <View
                    style={{
                        height: 50 - TIMELINE_CARD_PADDING,
                        top: TIMELINE_CARD_PADDING / 2,
                        marginHorizontal: TIMELINE_CARD_PADDING / 2,
                        backgroundColor: colors.accent_color,
                        justifyContent: 'center',
                        borderRadius: 3,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            const createScheduledHabitRequest: CreateScheduledHabitRequest = {
                                taskId: Number(habitId),
                                description: description,
                                daysOfWeekIds: daysOfWeek,
                                timesOfDayIds: timesOfDay,
                                quantity: parseFloat(quantity),
                                unitId: unit?.id ?? undefined,
                            };

                            HabitController.createScheduledHabit(createScheduledHabitRequest);
                            navigation.popToTop();
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 16,
                            }}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
};
