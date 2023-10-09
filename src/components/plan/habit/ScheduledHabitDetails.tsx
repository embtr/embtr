import { Animated, Keyboard, Switch, Text, View } from 'react-native';
import React from 'react';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ScheduledHabitQuantityInput } from 'src/components/plan/habit/ScheduledHabitQuantityInput';
import { ScheduledHabitUnitPicker } from 'src/components/plan/habit/ScheduledHabitUnitPicker';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';

interface Props {
    toggleVisibility: (
        enabled: boolean,
        setEnabled: Function,
        viewHeight: Animated.Value,
        maxHeight: number
    ) => void;
}

export const ScheduledHabitDetails = ({ toggleVisibility }: Props) => {
    const { colors } = useTheme();

    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(0));
    const [detailsEnabled, setDetailsEnabled] = React.useState(false);

    const DETAILS_HEIGHT = 100 + TIMELINE_CARD_PADDING;

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
                    <ScheduledHabitQuantityInput />
                </View>

                <View style={{ flex: 1, paddingTop: TIMELINE_CARD_PADDING }}>
                    <ScheduledHabitUnitPicker />
                </View>
            </Animated.View>
        </View>
    );
};
