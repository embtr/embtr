import * as React from 'react';
import { View, TouchableOpacity, Modal, Button, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';
import Slider from '@react-native-community/slider';

interface Props {
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const SetDurationModal = ({ visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    const [durationHours, setDurationHours] = React.useState(0);
    const [durationMinutes, setDurationMinutes] = React.useState(30);

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
                                <Text style={{ color: colors.text, fontSize: 12, paddingTop: 10, fontFamily: 'Poppins_400Regular', textAlign: 'center' }}>
                                    Duration
                                </Text>

                                <Text style={{ color: colors.text, fontSize: 16, fontFamily: 'Poppins_400Regular', textAlign: 'center', paddingTop: 5 }}>
                                    {durationHours}h {durationMinutes}m
                                </Text>

                                <View style={{ flexDirection: 'row', paddingLeft: 5, paddingTop: 15 }}>
                                    {/* BODY */}
                                    <Slider
                                        style={{ flex: 1, height: 40 }}
                                        step={1}
                                        minimumValue={0}
                                        maximumValue={23}
                                        onValueChange={setDurationHours}
                                        value={durationHours}
                                        minimumTrackTintColor={colors.tab_selected}
                                    />
                                    <Text
                                        style={{
                                            width: 80,
                                            paddingLeft: 5,
                                            color: colors.text,
                                            fontSize: 14,
                                            paddingTop: 10,
                                            fontFamily: POPPINS_REGULAR,
                                            paddingBottom: 8,
                                        }}
                                    >
                                        {' hours'}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                    <Slider
                                        style={{ flex: 1, height: 40 }}
                                        step={5}
                                        minimumValue={0}
                                        maximumValue={55}
                                        minimumTrackTintColor={colors.tab_selected}
                                        maximumTrackTintColor={colors.secondary_text}
                                        value={durationMinutes}
                                        onValueChange={setDurationMinutes}
                                    />
                                    <Text
                                        style={{
                                            width: 80,
                                            paddingLeft: 5,
                                            color: colors.text,
                                            fontSize: 14,
                                            paddingTop: 10,
                                            fontFamily: POPPINS_REGULAR,
                                            paddingBottom: 8,
                                        }}
                                    >
                                        {' minutes'}
                                    </Text>
                                </View>

                                <View style={{ height: 35 }} />
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
