import { Modal, Pressable, TouchableOpacity, View, Text } from 'react-native';
import { ModalBase } from '../modal/ModalBase';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from 'src/components/theme/ThemeProvider';
import React from 'react';
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';

interface Props {
    date: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    visible: boolean;
}

export const IOSDatePicker = ({ date, onConfirm, onCancel, visible }: Props) => {
    const { colors } = useTheme();

    const [currentDate, setCurrentDate] = React.useState(date);
    const [pickerWidth, setPickerWidth] = React.useState(0);

    // need this to refresh date while loading data
    // so the actual date is displayed, not new Date()
    React.useEffect(() => {
        setCurrentDate(date);
    }, [date]);

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType="fade">
                <Pressable
                    onPress={() => {
                        onConfirm(currentDate);
                    }}
                    style={{
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Pressable
                        style={{ backgroundColor: colors.modal_background, borderRadius: 9 }}
                        onPress={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <RNDateTimePicker
                            timeZoneOffsetInMinutes={0}
                            onLayout={(event) => {
                                setPickerWidth(event.nativeEvent.layout.width);
                            }}
                            testID="dateTimePicker"
                            display="spinner"
                            value={currentDate}
                            mode={'date'}
                            onChange={(event: DateTimePickerEvent, updatedDate?: Date) => {
                                if (event.type === 'set') {
                                    setCurrentDate(updatedDate || date);
                                }
                            }}
                        />
                    </Pressable>

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            paddingTop: PADDING_LARGE * 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                onConfirm(currentDate);
                            }}
                        >
                            <View
                                style={{
                                    paddingVertical: PADDING_LARGE / 2,
                                    backgroundColor: colors.modal_background,
                                    borderRadius: 6,
                                    width: pickerWidth,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: colors.text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 16,
                                    }}
                                >
                                    Confirm
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
