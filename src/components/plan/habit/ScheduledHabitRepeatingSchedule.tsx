import React from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, PADDING_LARGE, POPPINS_REGULAR, PADDING_SMALL } from 'src/util/constants';
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

    const REPEATING_SCHEDULE_HEIGHT = 50;
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

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            !repeatingScheduleEnabled,
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
                        Schedule
                    </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 11,
                            top: 1.5,
                            paddingRight: PADDING_SMALL,
                        }}
                    >
                        Daily Habit
                    </Text>
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
            </Animated.View>
        </View>
    );
};
