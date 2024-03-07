import React from 'react';
import { Text, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, PADDING_LARGE, POPPINS_REGULAR, PADDING_SMALL } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { View, Switch, Animated } from 'react-native';
import {
    CreateEditHabitMode,
    useCreateEditScheduleHabit,
} from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';
import { TimeOfDayMultiSelect } from './TimeOfDayMultiSelect';
import { TimeOfDaySingleSelect } from './TimeOfDaySingleSelect';

export const ScheduledHabitTimeOfDay = () => {
    const { colors } = useTheme();

    const { timeOfDayEnabled, setTimeOfDayEnabled, editMode } = useCreateEditScheduleHabit();
    const [timeOfDayViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));

    const TIME_OF_DAY_HEIGHT = 50;

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(
            !timeOfDayEnabled,
            timeOfDayViewHeight,
            TIME_OF_DAY_HEIGHT
        );
    }, [timeOfDayEnabled]);

    const useSingleSelect =
        CreateEditHabitMode.EDIT_EXISTING_PLANNED_HABIT === editMode ||
        CreateEditHabitMode.CREATE_NEW_PLANNED_HABIT === editMode;

    return (
        <View style={{ paddingBottom: PADDING_LARGE }}>
            <View
                style={{
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
                        All Day
                    </Text>
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
                    marginTop: PADDING_LARGE,
                    flexDirection: 'row',
                    height: timeOfDayViewHeight,
                    overflow: 'hidden',
                }}
            >
                {useSingleSelect ? <TimeOfDaySingleSelect /> : <TimeOfDayMultiSelect />}
            </Animated.View>
        </View>
    );
};
