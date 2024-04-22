import React from 'react';
import { Animated, Keyboard, Switch, Text, View } from 'react-native';
import { POPPINS_MEDIUM, PADDING_LARGE, POPPINS_REGULAR, PADDING_SMALL } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ScheduledHabitQuantityInput } from 'src/components/plan/habit/ScheduledHabitQuantityInput';
import { ScheduledHabitUnitPicker } from 'src/components/plan/habit/ScheduledHabitUnitPicker';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { runCreateEditScheduledHabitAnimation } from './CreateEditScheduledHabit';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

export const ScheduledHabitDetails = () => {
    const { colors } = useTheme();

    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));
    const { detailsEnabled, setDetailsEnabled, isChallenge } = useCreateEditScheduleHabit();

    const DETAILS_HEIGHT = 100 + PADDING_LARGE;

    React.useEffect(() => {
        runCreateEditScheduledHabitAnimation(detailsEnabled, detailsViewHeight, DETAILS_HEIGHT);
    }, [detailsEnabled]);

    return (
        <View style={{}}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={{ flex: 1, flexDirection: 'row' }}>
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

                <View
                    style={{
                        opacity: isChallenge ? 0.5 : 1,
                        pointerEvents: isChallenge ? 'none' : undefined,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
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
            >
                <View
                    style={{
                        flex: 1,
                        opacity: isChallenge ? 0.5 : 1,
                        pointerEvents: isChallenge ? 'none' : undefined,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <ScheduledHabitQuantityInput />
                    </View>

                    <View style={{ flex: 1, paddingTop: PADDING_LARGE }}>
                        <ScheduledHabitUnitPicker />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};
