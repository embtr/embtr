import * as React from 'react';
import { View, TouchableOpacity, Modal, Text, Pressable, TextInput, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { PlannedTask } from 'resources/schema';
import { UnitUtility } from 'src/util/UnitUtility';
import { EvilIcons } from '@expo/vector-icons';
import { getWindowHeight } from 'src/util/GeneralUtility';

interface Props {
    plannedTask: PlannedTask;
    visible: boolean;
    complete: Function;
    update: Function;
    fail: Function;
    dismiss: Function;
}

export const UpdatePlannedTaskModal = ({
    plannedTask,
    visible,
    complete,
    update,
    fail,
    dismiss,
}: Props) => {
    const { colors } = useTheme();

    React.useEffect(() => {
        setSelectedValue(plannedTask.completedQuantity ?? 0);
    }, [plannedTask]);

    const onDismissWrapper = () => {
        setKeyboardFocused(false);
        setSelectedValue(plannedTask.completedQuantity ?? 0);
        setInputWasFocused(false);
        dismiss();
    };

    const onCompleteWrapper = () => {
        setKeyboardFocused(false);
        complete();
        setInputWasFocused(false);
    };

    const onUpdateWrapper = () => {
        setKeyboardFocused(false);
        update(selectedValue ?? 0);
        setInputWasFocused(false);
    };

    const BUTTON_WIDTH = 90;

    const [selectedValue, setSelectedValue] = React.useState<number | null>(
        plannedTask.completedQuantity ?? 0
    );

    const [inputWasFocused, setInputWasFocused] = React.useState(false);

    const [keyboardFocused, setKeyboardFocused] = React.useState(false);

    const top = getWindowHeight() / 2 - 150;

    const textInputRef = React.useRef<TextInput>(null);

    return (
        <Modal visible={visible} transparent={true} animationType={'fade'}>
            <Pressable
                onPress={() => {
                    onDismissWrapper();
                }}
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(000,000,000,.6)',
                }}
            >
                <Pressable
                    onPress={() => {
                        setKeyboardFocused(false);
                        Keyboard.dismiss();
                    }}
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        flexDirection: 'row',
                        top: top,
                        alignSelf: 'center',
                    }}
                >
                    <View
                        style={{
                            borderRadius: 12,
                            backgroundColor: colors.modal_background,
                        }}
                    >
                        <View
                            style={{
                                width: 300,
                                backgroundColor: colors.modal_background,
                                borderRadius: 12,
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    paddingTop: 15,
                                    paddingBottom: 10,
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingBottom: 25,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontFamily: POPPINS_MEDIUM,
                                            color: colors.text,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {'Update Progress'}
                                    </Text>
                                    <Text
                                        style={{
                                            paddingTop: 10,
                                            fontSize: 16,
                                            fontFamily: POPPINS_REGULAR,
                                            color: colors.tab_selected,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {plannedTask.task?.title ?? ''}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View style={{ flex: 1 }} />
                                    <TextInput
                                        keyboardType={'numeric'}
                                        ref={textInputRef}
                                        onBlur={() => {
                                            setKeyboardFocused(false);
                                        }}
                                        onSubmitEditing={() => {
                                            onUpdateWrapper();
                                        }}
                                        onFocus={() => {
                                            setInputWasFocused(true);
                                            setKeyboardFocused(true);
                                            textInputRef.current?.setNativeProps({
                                                selection: {
                                                    start: 0,
                                                    end: selectedValue?.toString().length,
                                                },
                                            });
                                        }}
                                        value={selectedValue?.toString()}
                                        onChangeText={(text) => {
                                            textInputRef.current?.setNativeProps({
                                                selection: { start: text.length, end: text.length },
                                            });

                                            //allow period
                                            if (
                                                text.length > 0 &&
                                                text !== '.' &&
                                                isNaN(parseInt(text))
                                            ) {
                                                return;
                                            }

                                            setSelectedValue(
                                                text.length === 0 ? null : parseInt(text)
                                            );
                                        }}
                                        style={{
                                            color: colors.text,
                                            fontFamily: POPPINS_REGULAR,
                                            textAlign: 'center',
                                            fontSize: 20,
                                            paddingTop: 10,
                                        }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        {!keyboardFocused && (
                                            <EvilIcons
                                                onPress={() => {
                                                    textInputRef.current?.focus();
                                                }}
                                                name="pencil"
                                                size={20}
                                                color={colors.secondary_text}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_REGULAR,
                                        textAlign: 'center',
                                    }}
                                >{`${
                                    plannedTask.unit
                                        ? UnitUtility.getReadableUnit(plannedTask.unit, 2)
                                        : ''
                                }`}</Text>

                                {/* Close Or Save Section */}
                                <View
                                    style={{
                                        width: '100%',
                                        paddingTop: 20,
                                        flexDirection: 'row',
                                    }}
                                >
                                    {/* UPDATE BUTTON */}
                                    {inputWasFocused && (
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    padding: 5,
                                                    borderRadius: 5,
                                                    borderWidth: 1,
                                                    borderColor: colors.link,
                                                    width: BUTTON_WIDTH,
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    onUpdateWrapper();
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: colors.link,
                                                        fontFamily: POPPINS_REGULAR,
                                                    }}
                                                >
                                                    update
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* COMPLETE BUTTON */}
                                    {!inputWasFocused && (
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    padding: 5,
                                                    borderRadius: 5,
                                                    borderWidth: 1,
                                                    borderColor: colors.progress_bar_complete,
                                                    width: BUTTON_WIDTH,
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    onCompleteWrapper();
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: colors.progress_bar_complete,
                                                        fontFamily: POPPINS_REGULAR,
                                                    }}
                                                >
                                                    complete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
