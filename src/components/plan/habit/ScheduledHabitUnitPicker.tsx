import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Unit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { AndroidUnitPicker } from 'src/components/units/AndroidUnitPicker';
import { IOSUnitPicker } from 'src/components/units/IOSUnitPicker';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { UI } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { UnitUtility } from 'src/util/UnitUtility';

export const ScheduledHabitUnitPicker = () => {
    const { colors } = useTheme();

    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);

    const { unit, setUnit, quantity } = useCreateEditScheduleHabit();

    let selectedUnitValue = unit?.unit
        ? UnitUtility.getReadableUnit(unit, quantity ?? 2)
        : 'Of What?';
    selectedUnitValue = selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1);

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {isAndroidDevice() ? (
                <AndroidUnitPicker
                    defaultUnit={unit}
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        setUnit(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            ) : (
                <IOSUnitPicker
                    defaultUnit={unit}
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        setUnit(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            )}

            <Text style={{ color: colors.text, flex: 1 }}>Of What?</Text>
            <Pressable
                onPress={() => {
                    setShowSetUnitModal(true);
                }}
                style={{
                    height: 50,
                    width: UI.SCHEDULE_HABIT.DETAILS.DETAIL_WIDTH,
                    borderRadius: 12,
                    backgroundColor: colors.background_light,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        textAlign: 'center',
                        includeFontPadding: false,
                    }}
                >
                    {selectedUnitValue}
                </Text>
            </Pressable>
        </View>
    );
};
