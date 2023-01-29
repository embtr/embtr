import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';
import { isIosApp } from 'src/util/DeviceUtil';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const SetDurationModal = ({ visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(30);

    let durationHourPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        durationHourPickerItems.push(<Picker.Item key={'duration_hours_' + i} color={isIosApp() ? colors.text : 'black'} label={'' + i} value={i} />);
    }

    let durationMinutesPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 59; i++) {
        durationMinutesPickerItems.push(<Picker.Item key={'duration_minutes_' + i} color={isIosApp() ? colors.text : 'black'} label={'' + i} value={i} />);
    }

    return (
        <View>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <View style={{ position: 'absolute', zIndex: 1, height: '100%', width: '100%', backgroundColor: 'rgba(000,000,000,.6)' }}>
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
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{ width: '80%', backgroundColor: colors.modal_background, borderRadius: 12 }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: 'Poppins_400Regular' }}>Duration</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Picker style={{ flex: 1, color: colors.text }} selectedValue={durationHours} onValueChange={setDurationHours}>
                                            {durationHourPickerItems}
                                        </Picker>
                                        <Text
                                            style={{
                                                flex: 1,
                                                color: colors.text,
                                                fontSize: 14,
                                                paddingTop: 10,
                                                fontFamily: POPPINS_REGULAR,
                                                paddingBottom: 8,
                                            }}
                                        >
                                            {durationHours === 1 ? 'hour  ' : 'hours'}
                                        </Text>
                                        <Picker
                                            itemStyle={{ textAlign: 'center' }}
                                            style={{ flex: 1, color: colors.text }}
                                            selectedValue={durationMinutes}
                                            onValueChange={setDurationMinutes}
                                        >
                                            {durationMinutesPickerItems}
                                        </Picker>
                                        <Text
                                            style={{
                                                flex: 1,
                                                color: colors.text,
                                                fontSize: 14,
                                                paddingTop: 10,
                                                fontFamily: POPPINS_REGULAR,
                                                paddingBottom: 8,
                                            }}
                                        >
                                            minutes
                                        </Text>
                                    </View>
                                </View>

                                <HorizontalLine />

                                <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                    <Button
                                        title="Confirm"
                                        onPress={() => {
                                            confirm(durationHours * 60 + durationMinutes);
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ height: 5 }} />

                            <View style={{ width: '80%', backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                                <Button
                                    title="Cancel"
                                    onPress={() => {
                                        dismiss();
                                    }}
                                />
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
        </View>
    );
};
