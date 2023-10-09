import React from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { DaysOfTheWeekToggle } from 'src/components/plan/habit/DaysOfTheWeekToggle';
import { HabitDateView } from 'src/components/plan/habit/HabitDateView';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDate } from 'src/util/DateUtility';
import { DatePicker } from 'src/components/common/date/DatePicker';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

interface Props {
    toggleVisibility: (
        enabled: boolean,
        setEnabled: Function,
        viewHeight: Animated.Value,
        maxHeight: number
    ) => void;
}

export const ScheduleHabitRepeatingSchedule = ({ toggleVisibility }: Props) => {
    const { colors } = useTheme();

    const REPEATING_SCHEDULE_HEIGHT = 150 + TIMELINE_CARD_PADDING * 2;
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
        setRepeatingScheduleEnabled
    } = useCreateEditScheduleHabit();
    const [height] = React.useState<Animated.Value>(new Animated.Value(0));

    const startDatePretty = startDate ? formatDate(startDate) : 'Forever';
    const endDatePretty = endDate ? formatDate(endDate) : 'Forever';

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
    }, [startDateDatePickerModalVisible]);

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
    }, [endDateDatePickerModalVisible]);

    return (
        <View>
            {startDateDatePickerMemo}
            {endDateDatePickerMemo}

            <View
                style={{
                    paddingTop: TIMELINE_CARD_PADDING * 2,
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
                            toggleVisibility(
                                repeatingScheduleEnabled,
                                setRepeatingScheduleEnabled,
                                height,
                                REPEATING_SCHEDULE_HEIGHT
                            );
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
                    marginTop: TIMELINE_CARD_PADDING,
                    height: height,
                    overflow: 'hidden',
                }}
            >
                <DaysOfTheWeekToggle />

                <View style={{ width: '100%' }}>
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
                        paddingTop: TIMELINE_CARD_PADDING,
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
