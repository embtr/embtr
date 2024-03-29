import React from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { DaysOfTheWeekToggle } from 'src/components/plan/habit/DaysOfTheWeekToggle';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';

export const ScheduleHabitRepeatingSchedule = () => {
    const { colors } = useTheme();

    const REPEATING_SCHEDULE_HEIGHT = 50;
    const {
        daysOfWeekEnabled: repeatingScheduleEnabled,
        setDaysOfWeekEnabled: setRepeatingScheduleEnabled,
        daysOfWeek,
    } = useCreateEditScheduleHabit();
    const [height] = React.useState<Animated.Value>(new Animated.Value(0));

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            repeatingScheduleEnabled,
            height,
            REPEATING_SCHEDULE_HEIGHT
        );
    }, [repeatingScheduleEnabled]);

    return (
        <View style={{ paddingBottom: PADDING_LARGE }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 16,
                        }}
                    >
                        Days of the Week
                    </Text>

                    {repeatingScheduleEnabled && daysOfWeek.length < 1 && (
                        <Text
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

                <View style={{ flexDirection: 'row' }}>
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
