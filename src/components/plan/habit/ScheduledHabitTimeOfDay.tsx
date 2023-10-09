import React from 'react';
import { Text, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { View, Switch, Animated } from 'react-native';
import { TimesOfDayToggle } from './TimesOfDayToggle';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';
import { set } from 'lodash';

export const ScheduledHabitTimeOfDay = () => {
    const { colors } = useTheme();

    const { timeOfDayEnabled, setTimeOfDayEnabled } = useCreateEditScheduleHabit();
    const [timeOfDayViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const TIME_OF_DAY_HEIGHT = 50 + TIMELINE_CARD_PADDING;

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            timeOfDayEnabled,
            timeOfDayViewHeight,
            TIME_OF_DAY_HEIGHT
        );
    }, [timeOfDayEnabled]);

    return (
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
                            setTimeOfDayEnabled(!timeOfDayEnabled);
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
                <TimesOfDayToggle />
            </Animated.View>
        </View>
    );
};
