import { Picker } from '@react-native-picker/picker';
import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    name: string;
    description: string;
    initialStartMinute: number;
    initialDuration: number;
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const SchedulePlannableTaskModal = ({ name, description, initialStartMinute, initialDuration, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const initialStartHour = Math.floor(initialStartMinute / 60);
    const initialDurationHours = Math.floor(initialDuration / 60);
    const initialDurationMinutes = Math.floor(initialDuration % 60);

    const [hour, setHour] = React.useState(initialStartHour > 12 ? initialStartHour - 12 : initialStartHour);
    const [minute, setMinute] = React.useState(Math.floor(initialStartMinute % 60));
    const [amPm, setAmPm] = React.useState(initialStartMinute >= 12 ? 'PM' : 'AM');
    const [durationHours, setDurationHours] = React.useState(initialDurationHours);
    const [durationMinutes, setDurationMinutes] = React.useState(initialDurationMinutes);

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
    amPmPickerItems.push(<Picker.Item key={'amPm_am'} color={colors.text} label={'AM'} value={'AM'} />);
    amPmPickerItems.push(<Picker.Item key={'amPm_pm'} color={colors.text} label={'PM'} value={'PM'} />);

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
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
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
                            <View style={{ width: 300, backgroundColor: colors.modal_background, borderRadius: 12, justifyContent: 'space-around' }}>
                                <Text style={{ color: colors.text, fontSize: 16, paddingTop: 10, paddingLeft: 10, fontFamily: 'Poppins_500Medium' }}>
                                    {name}
                                </Text>

                                <Text
                                    style={{
                                        color: colors.text,
                                        fontSize: 10,
                                        paddingTop: 5,
                                        paddingLeft: 10,
                                        opacity: 0.75,
                                        fontFamily: 'Poppins_400Regular',
                                    }}
                                >
                                    {description}
                                </Text>

                                <View style={{ width: '100%', alignItems: 'center', paddingTop: 10 }}>
                                    <View style={{ width: '90%' }}>
                                        <HorizontalLine />
                                    </View>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: 'Poppins_400Regular' }}>Start Time</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Picker style={{ width: 85, color: colors.text }} selectedValue={hour} onValueChange={setHour}>
                                            {hourPickerItems}
                                        </Picker>
                                        <Picker style={{ width: 85, color: colors.text }} selectedValue={minute} onValueChange={setMinute}>
                                            {minutePickerItems}
                                        </Picker>
                                        <Picker style={{ width: 95, color: colors.text, borderRadius: 0 }} selectedValue={amPm} onValueChange={setAmPm}>
                                            {amPmPickerItems}
                                        </Picker>
                                    </View>
                                </View>

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
                                            const startTime = hour * 60 + minute + (amPm === 'AM' ? 0 : 12 * 60);
                                            const duration = durationHours * 60 + durationMinutes;
                                            confirm(startTime, duration);
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
