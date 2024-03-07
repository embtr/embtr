import React from 'react';
import { Animated, Keyboard, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, PADDING_LARGE } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ScheduledHabitQuantityInput } from 'src/components/plan/habit/ScheduledHabitQuantityInput';
import { ScheduledHabitUnitPicker } from 'src/components/plan/habit/ScheduledHabitUnitPicker';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const ScheduledHabitConfigurations = () => {
    const { colors } = useTheme();

    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));
    const { detailsEnabled, setDetailsEnabled } = useCreateEditScheduleHabit();

    const DETAILS_HEIGHT = 100 + PADDING_LARGE;

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(detailsEnabled, detailsViewHeight, DETAILS_HEIGHT);
    }, [detailsEnabled]);

    return (
        <View>
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
                        Use Multiple Schedules
                    </Text>
                </View>

                <View style={{}}>
                    <Switch
                        onValueChange={() => {
                            setDetailsEnabled(!detailsEnabled);
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
                    marginTop: PADDING_LARGE,
                    height: detailsViewHeight,
                    overflow: 'hidden',
                }}
            ></Animated.View>
        </View>
    );
};
