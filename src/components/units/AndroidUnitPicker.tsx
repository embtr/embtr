import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { POPPINS_REGULAR } from 'src/util/constants';
import { Unit } from 'resources/schema';
import { UnitController } from 'src/controller/unit/UnitController';
import { useAppSelector } from 'src/redux/Hooks';
import { getOpenMenu, getUnits } from 'src/redux/user/GlobalState';

interface Props {
    defaultUnit?: Unit;
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

/* Sacrifice today for tomorrow’s betterment, you are willing to pay those payments with pain, because pain is just a message when you are fixing something that’s insufficient in your life. Life isn’t about waiting for the storm to pass. It’s about dancing in the rain. If tomorrow doesn’t happen, would you still do what you’re about to do today? If that answer is no, you’re alive, but you’re not living. - triveNge - 2023-06-16 */

export const AndroidUnitPicker = ({ defaultUnit, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [selectedUnit, setSelectedUnit] = React.useState<Unit | undefined>(defaultUnit);

    const units = useAppSelector(getUnits);

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

    const pickerRef = React.useRef<Picker<Unit>>(null); // Create a ref for the Picker component

    return (
        <View style={{ display: 'none' }}>
            <Picker
                onBlur={() => {
                    dismiss();
                }}
                ref={pickerRef} // Set the ref to the Picker component
                placeholder="of what?"
                itemStyle={{
                    fontFamily: POPPINS_REGULAR,
                    color: colors.text,
                }}
                selectedValue={selectedUnit} // Set the selectedValue prop to the selectedUnit state
                onValueChange={(itemValue, itemIndex) => {
                    confirm(itemValue);
                }}
            >
                {units.map((unit) => {
                    if (!unit.unit) return null;

                    const selectedUnitValue = unit.unit.toString().toLowerCase();
                    const capitalizedUnitValue =
                        selectedUnitValue.charAt(0).toUpperCase() +
                        selectedUnitValue.slice(1) +
                        's';

                    return (
                        <Picker.Item
                            label={capitalizedUnitValue}
                            value={unit} // Set the value prop to the unit object
                            key={unit.id}
                        />
                    );
                })}
            </Picker>
        </View>
    );
};
