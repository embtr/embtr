import React from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, PADDING_LARGE } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { DaysOfTheWeekToggle } from 'src/components/plan/habit/DaysOfTheWeekToggle';
import { HabitDateView } from 'src/components/plan/habit/HabitDateView';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDate } from 'src/util/DateUtility';
import { DatePicker } from 'src/components/common/date/DatePicker';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';

export const ScheduleHabitRepeatingSchedule = () => {
    const { colors } = useTheme();

    const REPEATING_SCHEDULE_HEIGHT = 150 + PADDING_LARGE * 2;
    const {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startDateDatePickerModalVisible,
        setStartDateDatePickerModalVisible,
        endDateDatePickerModalVisible,
        setEndDateDatePickerModalVisible,
        repeatingScheduleEnabled,
        setRepeatingScheduleEnabled,
    } = useCreateEditScheduleHabit();
    const [height] = React.useState<Animated.Value>(new Animated.Value(0));

    const startDatePretty = startDate ? formatDate(startDate) : 'Forever';
    const endDatePretty = endDate ? formatDate(endDate) : 'Forever';

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            repeatingScheduleEnabled,
            height,
            REPEATING_SCHEDULE_HEIGHT
        );
    }, [repeatingScheduleEnabled]);

    //TODO React.useMemo() vs React.memo()
    const startDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={startDateDatePickerModalVisible}
                date={startDate ?? new Date()}
                onConfirm={(date: Date) => {
                    setStartDateDatePickerModalVisible(false);
                    setStartDate(date);
                }}
                onCancel={() => {
                    setStartDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [startDate, startDateDatePickerModalVisible]);

    const endDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={endDateDatePickerModalVisible}
                date={endDate ?? new Date()}
                onConfirm={(date: Date) => {
                    setEndDateDatePickerModalVisible(false);
                    setEndDate(date);
                }}
                onCancel={() => {
                    setEndDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [endDate, endDateDatePickerModalVisible]);

    return (
        <View style={{ paddingBottom: PADDING_LARGE }}>
            {startDateDatePickerMemo}
            {endDateDatePickerMemo}

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                        }}
                    >
                        Repeating Schedule
                    </Text>
                </View>

                <View>
                    <Switch
                        value={repeatingScheduleEnabled}
                        onValueChange={() => {
                            setRepeatingScheduleEnabled(!repeatingScheduleEnabled);
                        }}
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
                    marginTop: PADDING_LARGE,
                    height: height,
                    overflow: 'hidden',
                }}
            >
                <DaysOfTheWeekToggle />

                <View
                    style={{
                        width: '100%',
                        paddingTop: PADDING_LARGE,
                    }}
                >
                    <HabitDateView
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
                        paddingTop: PADDING_LARGE,
                    }}
                >
                    <HabitDateView
                        dateType="End Date"
                        prettyDate={endDatePretty}
                        onPress={() => {
                            setEndDateDatePickerModalVisible(true);
                        }}
                    />
                </View>
            </Animated.View>
        </View>
    );
};
