import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { POPPINS_REGULAR } from 'src/util/constants';
import { Unit } from 'resources/schema';
import { UnitController } from 'src/controller/unit/UnitController';

interface Props {
    defaultUnit?: Unit;
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const IOSUnitPicker = ({ defaultUnit, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [units, setUnits] = React.useState<Unit[]>([]);
    const [selectedUnitId, setSelectedUnitId] = React.useState<number | undefined>(defaultUnit?.id);

    const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

    const fetchUnits = async () => {
        const units = await UnitController.getAll();
        setUnits(units);
    };

    React.useEffect(() => {
        fetchUnits();
    }, []);

    React.useEffect(() => {
        if (visible) {
            pickerRef.current?.focus();
        }
    }, [visible]);

    let displayUnit = '';
    if (selectedUnit?.unit) {
        const selectedUnitValue = selectedUnit.unit.toString().toLowerCase();
        displayUnit = selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1) + 's';
    }

    const pickerRef = React.useRef<Picker<number>>(null); // Create a ref for the Picker component

    return (
        <Modal visible={visible} transparent={true} animationType={'fade'}>
            <View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(000,000,000,.6)',
                }}
            >
                <TouchableOpacity
                    style={{ flex: 1, width: '100%' }}
                    onPress={() => {
                        dismiss();
                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            dismiss();
                        }}
                    />
                    <View>
                        <View
                            style={{
                                width: 300,
                                backgroundColor: colors.modal_background,
                                borderRadius: 12,
                                justifyContent: 'space-around',
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    paddingTop: 15,
                                    paddingBottom: 10,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'Poppins_500Medium',
                                            color: colors.text,
                                            textAlign: 'center',
                                        }}
                                    >
                                        Select Units
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ flex: 1 }}>
                                            <Picker
                                                ref={pickerRef} // Set the ref to the Picker component
                                                placeholder="of what?"
                                                itemStyle={{
                                                    fontFamily: POPPINS_REGULAR,
                                                    color: colors.text,
                                                }}
                                                selectedValue={selectedUnit?.id ?? 0} // Set the selectedValue prop to the selectedUnit state
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setSelectedUnitId(itemValue);
                                                }}
                                            >
                                                <Picker.Item label="None" value={undefined} />
                                                {units.map((unit) => {
                                                    if (!unit.unit) return null;

                                                    const selectedUnitValue = unit.unit
                                                        .toString()
                                                        .toLowerCase();
                                                    const capitalizedUnitValue =
                                                        selectedUnitValue.charAt(0).toUpperCase() +
                                                        selectedUnitValue.slice(1) +
                                                        's';

                                                    return (
                                                        <Picker.Item
                                                            label={capitalizedUnitValue}
                                                            value={unit!.id!} // Set the value prop to a unique identifier for the unit
                                                            key={unit.id}
                                                        />
                                                    );
                                                })}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <HorizontalLine />

                            <View
                                style={{
                                    backgroundColor: colors.modal_background,
                                    borderRadius: 12,
                                    paddingTop: 2.5,
                                    paddingBottom: 2.5,
                                }}
                            >
                                <Button
                                    title="save"
                                    onPress={() => {
                                        confirm(selectedUnit);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, width: '100%' }}
                        onPress={() => {
                            dismiss();
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={{ flex: 1, width: '100%' }}
                    onPress={() => {
                        dismiss();
                    }}
                />
            </View>
        </Modal>
    );
};
