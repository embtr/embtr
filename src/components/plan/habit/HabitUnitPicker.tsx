import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Unit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { AndroidUnitPicker } from 'src/components/units/AndroidUnitPicker';
import { IOSUnitPicker } from 'src/components/units/IOSUnitPicker';
import { isAndroidDevice } from 'src/util/DeviceUtil';

interface Props {
    detailName: string;
    onUnitChanged: Function;
}

export const HabitUnitPicker = ({ detailName, onUnitChanged }: Props) => {
    const { colors } = useTheme();

    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);
    const [unit, setUnit] = React.useState<Unit>();

    let selectedUnitValue = unit?.unit ? unit.unit.toString().toLowerCase() : 'Of What?';
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
                        onUnitChanged(selected);
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
                        onUnitChanged(selected);
                        setUnit(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            )}

            <Text style={{ color: colors.text, flex: 1 }}>{detailName}</Text>
            <Pressable
                onPress={() => {
                    setShowSetUnitModal(true);
                }}
                style={{
                    height: 50,
                    width: 90,
                    borderRadius: 12,
                    backgroundColor: colors.text_input_background,
                    borderColor: colors.text_input_border,
                    borderWidth: 1,
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
