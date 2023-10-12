import * as React from 'react';
import { View, TouchableOpacity, Modal, Text, Pressable, TextInput, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { PlannedTask } from 'resources/schema';
import { UnitUtility } from 'src/util/UnitUtility';
import { EvilIcons } from '@expo/vector-icons';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { Ionicons } from '@expo/vector-icons';
import { set } from 'lodash';

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

    const onEdit = () => {
        if (keyboardFocused) {
            Keyboard.dismiss();
            setKeyboardFocused(false);
        }

        setInputWasFocused(false);
        dismiss(plannedTask.scheduledHabitId);
    };

    const onDismissWrapper = () => {
        if (menuVisible) {
            setMenuVisible(false);
        } else if (keyboardFocused) {
            Keyboard.dismiss();
            setKeyboardFocused(false);
            setSelectedValue(plannedTask.completedQuantity ?? 0);
        } else {
            setInputWasFocused(false);
            dismiss();
        }
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

    const [menuVisible, setMenuVisible] = React.useState(false);

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
                        setMenuVisible(false);
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
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingBottom: 25,
                                }}
                            >
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{ flex: 1 }} />
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            flex: 10,
                                            fontFamily: POPPINS_MEDIUM,
                                            color: colors.text,
                                            paddingTop: 15,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {'Update Progress'}
                                    </Text>

                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setMenuVisible(true);
                                            }}
                                        >
                                            <Ionicons
                                                style={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    left: -5,
                                                }}
                                                name={'ellipsis-horizontal'}
                                                size={20}
                                                color={colors.secondary_text}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        paddingTop: 10,
                                        fontSize: 20,
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.accent_color,
                                        textAlign: 'center',
                                    }}
                                >
                                    {plannedTask.title ?? ''}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Ionicons
                                        name={'remove'}
                                        size={30}
                                        color={colors.text}
                                        onPress={() => {
                                            setSelectedValue((selectedValue ?? 0) - 1);
                                            setInputWasFocused(true);
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
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
                                                selection: {
                                                    start: text.length,
                                                    end: text.length,
                                                },
                                            });

                                            if (text.length > 0 && isNaN(parseInt(text))) {
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
                                    <View
                                        style={{
                                            flex: 1,
                                        }}
                                    >
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

                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name={'add'}
                                        size={30}
                                        color={colors.text}
                                        onPress={() => {
                                            setSelectedValue((selectedValue ?? 0) + 1);
                                            setInputWasFocused(true);
                                        }}
                                    />
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
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        paddingBottom: 10,
                                    }}
                                >
                                    {/* UPDATE BUTTON */}
                                    {/* {inputWasFocused && (
                                        <TouchableOpacity
                                            style={{
                                                padding: 5,
                                                borderRadius: 5,
                                                borderWidth: 1,
                                                borderColor: colors.secondary_accent_color,
                                                width: BUTTON_WIDTH,
                                                alignItems: 'center',
                                            }}
                                            onPress={() => {
                                                onUpdateWrapper();
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: colors.secondary_accent_color,
                                                    fontFamily: POPPINS_REGULAR,
                                                }}
                                            >
                                                update
                                            </Text>
                                        </TouchableOpacity>
                                    )} */}

                                    {/* COMPLETE BUTTON */}
                                    {/* {!inputWasFocused && (
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
                                    )} */}
                                    <View
                                        style={{
                                            width: '100%',
                                            paddingHorizontal: TIMELINE_CARD_PADDING,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: '100%',
                                                backgroundColor: colors.accent_color,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                flex: 9,
                                            }}
                                        >
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        color: colors.text,
                                                        fontFamily: POPPINS_REGULAR,
                                                        fontSize: 16,
                                                        paddingLeft: '10%',
                                                        marginLeft: 3,
                                                        paddingVertical: 6,
                                                    }}
                                                >
                                                    update
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'white',
                                                borderTopRightRadius: 5,
                                                borderBottomRightRadius: 5,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingHorizontal: 3,
                                            }}
                                            onPress={() => {
                                                setMenuVisible(true);
                                            }}
                                        >
                                            <Ionicons
                                                name={'chevron-down'}
                                                size={20}
                                                color={'black'}
                                            />
                                            {menuVisible && (
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        zIndex: 1,
                                                        left: -71, // Align to the left of the parent container
                                                        bottom: -100 - (1.5 * TIMELINE_CARD_PADDING ), // Align to the bottom of the parent container
                                                        borderRadius: 12,
                                                        borderWidth: 2,
                                                        borderColor: 'yellow',
                                                    }}
                                                >
                                                    <View style={{ borderRadius: 9 }}>
                                                        <View
                                                            style={{
                                                                height: 25,
                                                                width: 100,
                                                                backgroundColor:
                                                                    colors.secondary_text,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily: POPPINS_REGULAR,
                                                                    textAlign: 'center',
                                                                    paddingTop: 2,
                                                                }}
                                                            >
                                                                Skip Today
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                height: 25,
                                                                width: 100,
                                                                backgroundColor:
                                                                    colors.secondary_text,
                                                                borderTopColor: 'black',
                                                                borderTopWidth: 1,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily: POPPINS_REGULAR,
                                                                    textAlign: 'center',
                                                                    paddingTop: 2,
                                                                }}
                                                            >
                                                                Edit
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                height: 25,
                                                                width: 100,
                                                                backgroundColor:
                                                                    colors.secondary_text,
                                                                borderTopColor: 'black',
                                                                borderTopWidth: 1,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily: POPPINS_REGULAR,
                                                                    textAlign: 'center',
                                                                    paddingTop: 2,
                                                                }}
                                                            >
                                                                Edit
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                height: 25,
                                                                width: 100,
                                                                backgroundColor:
                                                                    colors.secondary_text,
                                                                borderTopColor: 'black',
                                                                borderTopWidth: 1,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily: POPPINS_REGULAR,
                                                                    textAlign: 'center',
                                                                    paddingTop: 2,
                                                                }}
                                                            >
                                                                Edit
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
