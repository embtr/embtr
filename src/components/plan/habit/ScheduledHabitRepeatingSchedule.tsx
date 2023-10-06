import React from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { DaysOfTheWeekToggle } from 'src/components/plan/habit/DaysOfTheWeekToggle';
import { HabitDateView } from 'src/components/plan/habit/HabitDateView';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDate } from 'src/util/DateUtility';
import {DatePicker} from 'src/components/common/date/DatePicker';
import { DayOfWeek } from 'resources/schema';

export const useScheduledHabitRepeatingScheduleDetails = () => {
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [startDateDatePickerModalVisible, setStartDateDatePickerModalVisible] =
        React.useState(false);
    const [endDateDatePickerModalVisible, setEndDateDatePickerModalVisible] = React.useState(false);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [daysOfWeek, setDaysOfWeek] = React.useState<DayOfWeek[]>([]);

    return {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startDateDatePickerModalVisible,
        setStartDateDatePickerModalVisible,
        endDateDatePickerModalVisible,
        setEndDateDatePickerModalVisible,
        detailsVisible,
        setDetailsVisible,
        daysOfWeek,
        setDaysOfWeek,
    };
};

interface Props {
    props: ReturnType<typeof useScheduledHabitRepeatingScheduleDetails>;
    onVisibilityToggled: (
        enabled: boolean,
        setEnabled: Function,
        viewHeight: Animated.Value,
        maxHeight: number
    ) => void;
}

export const ScheduleHabitRepeatingSchedule = ({ props, onVisibilityToggled }: Props) => {
    const { colors } = useTheme();

    const REPEATING_SCHEDULE_HEIGHT = 150 + TIMELINE_CARD_PADDING * 2;
    const [height] = React.useState<Animated.Value>(new Animated.Value(0));

    const startDatePretty = props.startDate ? formatDate(props.startDate) : 'Forever';
    const endDatePretty = props.endDate ? formatDate(props.endDate) : 'Forever';

    //TODO React.useMemo() vs React.memo()
    const startDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={props.startDateDatePickerModalVisible}
                date={props.startDate ?? new Date()}
                onConfirm={(date: Date) => {
                    props.setStartDateDatePickerModalVisible(false);
                    props.setStartDate(date);
                }}
                onCancel={() => {
                    props.setStartDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [props.startDateDatePickerModalVisible]);

    const endDateDatePickerMemo = React.useMemo(() => {
        return (
            <DatePicker
                visible={props.endDateDatePickerModalVisible}
                date={props.endDate ?? new Date()}
                onConfirm={(date: Date) => {
                    props.setEndDateDatePickerModalVisible(false);
                    props.setEndDate(date);
                }}
                onCancel={() => {
                    props.setEndDateDatePickerModalVisible(false);
                }}
            />
        );
    }, [props.endDateDatePickerModalVisible]);

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
                        value={props.detailsVisible}
                        onValueChange={() => {
                            onVisibilityToggled(
                                props.detailsVisible,
                                props.setDetailsVisible,
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
                <DaysOfTheWeekToggle
                    daysOfWeek1={props.daysOfWeek}
                    onDaysChanged={props.setDaysOfWeek}
                />

                <View style={{ width: '100%' }}>
                    <HabitDateView
                        dateType="Start Date"
                        prettyDate={startDatePretty}
                        onPress={() => {
                            props.setStartDateDatePickerModalVisible(true);
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
                            props.setEndDateDatePickerModalVisible(true);
                        }}
                    />
                </View>
            </Animated.View>
        </View>
    );
};
