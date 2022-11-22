import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const SetDurationModal = ({ visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(30);

    let hourPickerItems: JSX.Element[] = [];
    for (let i = 1; i <= 12; i++) {
        hourPickerItems.push(<Picker.Item key={'hour_' + i} color={colors.text} label={'' + i} value={i} />);
    }

    let minutePickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 59; i += 15) {
        let val = '' + i;
        if (i < 10) {
            val = '0' + i;
        }
        minutePickerItems.push(<Picker.Item key={'minute_' + val} color={colors.text} label={'' + val} value={i} />);
    }

    let amPmPickerItems: JSX.Element[] = [];
    amPmPickerItems.push(<Picker.Item key={'amPm_am'} color={colors.text} label={'AM'} value={'am'} />);
    amPmPickerItems.push(<Picker.Item key={'amPm_pm'} color={colors.text} label={'PM'} value={'pm'} />);

    let durationHourPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 23; i++) {
        durationHourPickerItems.push(<Picker.Item key={'duration_hours_' + i} color={colors.text} label={'' + i} value={i} />);
    }

    let durationMinutesPickerItems: JSX.Element[] = [];
    for (let i = 0; i <= 59; i++) {
        durationMinutesPickerItems.push(<Picker.Item key={'duration_minutes_' + i} color={colors.text} label={'' + i} value={i} />);
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
                        <View>
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: 'space-around' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: 'Poppins_400Regular' }}>Duration</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Picker style={{ width: 85, color: colors.text }} selectedValue={durationHours} onValueChange={setDurationHours}>
                                            {durationHourPickerItems}
                                        </Picker>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 14,
                                                paddingTop: 10,
                                                fontFamily: POPPINS_SEMI_BOLD,
                                                right: 5,
                                                paddingBottom: 8,
                                            }}
                                        >
                                            {durationHours === 1 ? 'hour  ' : 'hours'}
                                        </Text>
                                        <Picker style={{ width: 85, color: colors.text }} selectedValue={durationMinutes} onValueChange={setDurationMinutes}>
                                            {durationMinutesPickerItems}
                                        </Picker>
                                        <Text
                                            style={{
                                                color: colors.text,
                                                fontSize: 14,
                                                paddingTop: 10,
                                                fontFamily: POPPINS_SEMI_BOLD,
                                                right: 5,
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

                            <View style={{ backgroundColor: colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
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
