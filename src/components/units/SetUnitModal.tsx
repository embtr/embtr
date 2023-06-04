import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { POPPINS_REGULAR } from 'src/util/constants';
import { UnitType } from 'resources/schema';

interface Props {
    defaultUnit?: UnitType;
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const SetUnitModal = ({ defaultUnit, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [selectedUnit, setSelectedUnit] = React.useState<UnitType | undefined>(defaultUnit);

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
                                                placeholder="of what?"
                                                selectedValue={selectedUnit}
                                                itemStyle={{
                                                    fontFamily: POPPINS_REGULAR,
                                                    color: colors.text,
                                                }}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    setSelectedUnit(itemValue)
                                                }
                                            >
                                                {Object.values(UnitType).map((unit) => {
                                                    const selectedUnitValue = unit
                                                        .toString()
                                                        .toLowerCase();
                                                    const capitalizedUnitValue =
                                                        selectedUnitValue.charAt(0).toUpperCase() +
                                                        selectedUnitValue.slice(1);
                                                    return (
                                                        <Picker.Item
                                                            label={capitalizedUnitValue}
                                                            value={unit}
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
