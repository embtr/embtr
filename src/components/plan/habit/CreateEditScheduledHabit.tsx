import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Text, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitController, HabitCustomHooks } from 'src/controller/habit/HabitController';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { View, Switch, Animated, Easing } from 'react-native';
import { HabitQuantityInput } from './HabitQuantityInput';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import { CreateScheduledHabitRequest } from 'resources/types/requests/ScheduledHabitTypes';
import { TimesOfDayToggle } from './TimesOfDayToggle';
import { HabitUnitPicker } from './HabitUnitPicker';
import { DayOfWeek, TimeOfDay, Unit } from 'resources/schema';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlannedHabitCustomHooks } from 'src/controller/habit/PlannedHabitController';
import { LoadingOverlay } from 'src/components/common/loading/LoadingOverlay';
import { ScheduleHabitDescription } from 'src/components/plan/habit/ScheduleHabitDescription';
import {
    ScheduleHabitRepeatingSchedule,
    useScheduledHabitRepeatingScheduleDetails,
} from 'src/components/plan/habit/ScheduledHabitRepeatingSchedule';

// 600 lines? Thems rookie numbers - TheCaptainCoder - 2023-10-06

export const CreateEditScheduledHabit = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'CreateEditScheduledHabit'>>();

    const habitId = route.params.habitId;
    const habit = HabitCustomHooks.useHabit(Number(habitId));

    const plannedTaskId = route.params.plannedTaskId;
    const plannedTask = PlannedHabitCustomHooks.usePlannedHabit(Number(plannedTaskId));

    const scheduledHabitId = route.params.scheduledHabitId;
    const scheduledHabit = HabitCustomHooks.useScheduledHabit(Number(scheduledHabitId));

    React.useEffect(() => {
        if (habit.data) {
            setTitle(habit.data.title ?? '');
        }
    }, [habit]);

    const [icon, setIcon] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);
    const [timesOfDay, setTimesOfDay] = React.useState<TimeOfDay[]>([]);
    const [quantity, setQuantity] = React.useState('');
    const [unit, setUnit] = React.useState<Unit | undefined>(undefined);

    const [timeOfDayEnabled, setTimeOfDayEnabled] = React.useState(false);
    const [timeOfDayViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const [detailsEnabled, setDetailsEnabled] = React.useState(false);
    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const TIME_OF_DAY_HEIGHT = 50 + TIMELINE_CARD_PADDING;
    const DETAILS_HEIGHT = 100 + TIMELINE_CARD_PADDING;

    const repeatingScheduleData = useScheduledHabitRepeatingScheduleDetails();

    const runAnimation = (viewHeight: Animated.Value, maxHeight: number = 50) => {
        Animated.timing(viewHeight, {
            toValue: maxHeight, // Set the desired height
            duration: 0, // Adjust the duration as needed
            easing: Easing.ease, // Adjust the easing function as needed
            useNativeDriver: false, // Make sure to set this to false for height animation
        }).start();
    };

    React.useEffect(() => {
        if (!scheduledHabit.data) {
            return;
        }

        setIcon(scheduledHabit.data.task?.iconUrl ?? '');
        setTitle(scheduledHabit.data.task?.title ?? '');
        setDescription(scheduledHabit.data.description ?? '');
        setDaysOfWeek(scheduledHabit.data.daysOfWeek ?? []);
        setTimesOfDay(scheduledHabit.data.timesOfDay ?? []);
        setQuantity(scheduledHabit.data.quantity?.toString() ?? '');
        setUnit(scheduledHabit.data.unit);

        //if (scheduledHabit.data.daysOfWeek?.length !== 0) {
        //    setRepeatingScheduleEnabled(true);
        //    runAnimation(repeatingScheduleViewHeight, REPEATING_SCHEDULE_HEIGHT);
        //}

        if (scheduledHabit.data.timesOfDay?.length !== 0) {
            setTimeOfDayEnabled(true);
            runAnimation(timeOfDayViewHeight, TIME_OF_DAY_HEIGHT);
        }

        if (scheduledHabit.data.quantity !== undefined || scheduledHabit.data.unit !== undefined) {
            setDetailsEnabled(true);
            runAnimation(detailsViewHeight, DETAILS_HEIGHT);
        }
    }, [scheduledHabit.data]);

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

    const loading = plannedTask.isLoading || scheduledHabit.isLoading || habit.isLoading;
    //todo - implement me
    //const scheduledHabitId = route.params.scheduledHabitId;

    return (
        <Screen>
            <LoadingOverlay active={loading} />
            <Banner name={'Schedule Habit'} leftRoute="BACK" leftIcon={'arrow-back'} />

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
                                <SvgUri width={37.5} height={37.5} uri={icon} />
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
                    <ScheduleHabitDescription
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                        onChangeText={setDescription}
                        text={description}
                    />

                    {/* Repeating Schedule */}
                    <ScheduleHabitRepeatingSchedule
                        props={repeatingScheduleData}
                        onVisibilityToggled={toggleVisibility}
                    />

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
                                            timeOfDayViewHeight,
                                            TIME_OF_DAY_HEIGHT
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
                            <TimesOfDayToggle
                                onTimesChanged={setTimesOfDay}
                                toggledTimesOfDay={timesOfDay}
                            />
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
                                            DETAILS_HEIGHT
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
                                <HabitUnitPicker
                                    detailName={'Of What?'}
                                    currentUnit={unit}
                                    onUnitChanged={setUnit}
                                />
                            </View>
                        </Animated.View>
                    </View>
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
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
                            };

                            if (repeatingScheduleData.detailsVisible) {
                                createScheduledHabitRequest.daysOfWeekIds = daysOfWeek
                                    .map((dayOfWeek) => dayOfWeek.id)
                                    .filter((id) => id !== undefined) as number[];
                                createScheduledHabitRequest.startDate =
                                    repeatingScheduleData.startDate;
                                createScheduledHabitRequest.endDate = repeatingScheduleData.endDate;
                            }

                            if (detailsEnabled) {
                                createScheduledHabitRequest.quantity = parseFloat(quantity);
                                createScheduledHabitRequest.unitId = unit?.id ?? undefined;
                            }

                            if (timeOfDayEnabled) {
                                createScheduledHabitRequest.timesOfDayIds = timesOfDay
                                    .map((timeOfDay) => timeOfDay.id)
                                    .filter((id) => id !== undefined) as number[];
                            }

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
