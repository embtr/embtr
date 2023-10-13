import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    Animated,
    Easing,
    StyleSheet,
} from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { PlannedTask } from 'resources/schema';
import { UnitUtility } from 'src/util/UnitUtility';
import { EvilIcons } from '@expo/vector-icons';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { RemoveHabitModal } from './habit/RemoveHabitModal';

interface Props {
    plannedTask: PlannedTask;
    visible: boolean;
    complete: Function;
    update: Function;
    fail: Function;
    dismiss: Function;
    remove: Function;
}

export const UpdatePlannedTaskModal = ({
    plannedTask,
    visible,
    complete,
    update,
    fail,
    dismiss,
    remove,
}: Props) => {
    const { colors } = useTheme();
    const MAX_OPTIONS_HEIGHT = 20 + TIMELINE_CARD_PADDING;

    const [menuVisible, setMenuVisible] = React.useState(false);
    const [inputWasFocused, setInputWasFocused] = React.useState(false);
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);

    const [advancedOptionsHeight] = React.useState<Animated.Value>(
        new Animated.Value(MAX_OPTIONS_HEIGHT)
    );

    const fontSize = 14;
    const fontFamily = POPPINS_REGULAR;

    const runAnimation = (expand: boolean, viewHeight: Animated.Value) => {
        Animated.timing(viewHeight, {
            toValue: expand ? MAX_OPTIONS_HEIGHT : 0, // Set the desired height
            duration: 125, // Adjust the duration as needed
            easing: Easing.ease, // Adjust the easing function as needed
            useNativeDriver: false, // Make sure to set this to false for height animation
        }).start();
    };

    React.useEffect(() => {
        runAnimation(menuVisible, advancedOptionsHeight);
    }, [menuVisible]);

    React.useEffect(() => {
        setSelectedValue(plannedTask.completedQuantity ?? 0);
    }, [plannedTask]);

    const onRemove = () => {
        setMenuVisible(false);
        setKeyboardFocused(false);
        setInputWasFocused(false);
        remove();
    };

    const onEdit = () => {
        if (keyboardFocused) {
            Keyboard.dismiss();
            setKeyboardFocused(false);
        }

        setMenuVisible(false);
        setInputWasFocused(false);
        dismiss(plannedTask.scheduledHabitId);
    };

    const onDismissWrapper = () => {
        if (keyboardFocused) {
            Keyboard.dismiss();
            setKeyboardFocused(false);
            setSelectedValue(plannedTask.completedQuantity ?? 0);
        } else {
            setInputWasFocused(false);
            setMenuVisible(false);
            dismiss();
        }
    };

    const onCompleteWrapper = () => {
        setMenuVisible(false);
        setKeyboardFocused(false);
        complete();
        setInputWasFocused(false);
    };

    const onUpdateWrapper = () => {
        setMenuVisible(false);
        setKeyboardFocused(false);
        update(selectedValue ?? 0);
        setInputWasFocused(false);
    };

    const [selectedValue, setSelectedValue] = React.useState<number | null>(
        plannedTask.completedQuantity ?? 0
    );

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
                                width: 350,
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
                                        paddingLeft: TIMELINE_CARD_PADDING,
                                        paddingTop: TIMELINE_CARD_PADDING,
                                    }}
                                >
                                    <View style={{ width: 20, height: 20 }}>
                                        <SvgUri
                                            width={20}
                                            height={20}
                                            uri={plannedTask.iconUrl ?? ''}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: 20,
                                                fontFamily: POPPINS_MEDIUM,
                                                color: colors.text,
                                                paddingLeft: TIMELINE_CARD_PADDING,
                                                bottom: 5,
                                            }}
                                        >
                                            {plannedTask.title ?? ''}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            width: 20,
                                            alignItems: 'flex-end',
                                            marginRight: TIMELINE_CARD_PADDING,
                                        }}
                                    >
                                        <Ionicons
                                            style={{ alignItems: 'flex-end', left: 5, bottom: 5 }}
                                            name={'close'}
                                            size={20}
                                            color={colors.secondary_text}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View style={{ flex: 1 }} />
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

                                <View style={{ flex: 1 }} />
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
                                    paddingBottom: TIMELINE_CARD_PADDING,
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                    }}
                                >
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
                                            <TouchableOpacity onPress={onUpdateWrapper}>
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
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: colors.secondary_text,
                                                width: StyleSheet.hairlineWidth,
                                                height: '100%',
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                borderTopRightRadius: 5,
                                                borderBottomRightRadius: 5,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingHorizontal: 3,
                                                backgroundColor: colors.accent_color,
                                            }}
                                            onPress={() => {
                                                setMenuVisible(!menuVisible);
                                            }}
                                        >
                                            <Ionicons
                                                style={{
                                                    backgroundColor: colors.accent_color,
                                                }}
                                                name={menuVisible ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                color={'black'}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <Animated.View
                                        style={{
                                            overflow: 'hidden',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            height: advancedOptionsHeight,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                height: 20,
                                                paddingHorizontal: TIMELINE_CARD_PADDING,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={onRemove}
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingLeft: 3,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily,
                                                        fontSize,
                                                        color: colors.archive,
                                                    }}
                                                >
                                                    remove
                                                </Text>
                                            </TouchableOpacity>

                                            {/* spacer */}
                                            <View style={{ flex: 1 }} />

                                            <TouchableOpacity
                                                onPress={onEdit}
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily,
                                                        fontSize,
                                                        color: colors.link,
                                                    }}
                                                >
                                                    edit
                                                </Text>
                                            </TouchableOpacity>

                                            {/* spacer */}
                                            <View style={{ flex: 1 }} />

                                            <TouchableOpacity
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily,
                                                        fontSize,
                                                        color: colors.trophy_icon,
                                                    }}
                                                >
                                                    skip
                                                </Text>
                                            </TouchableOpacity>

                                            {/* spacer */}
                                            <View style={{ flex: 1 }} />

                                            <TouchableOpacity
                                                onPress={onCompleteWrapper}
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingRight: 3,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily,
                                                        fontSize,
                                                        color: colors.timeline_label_user_post,
                                                    }}
                                                >
                                                    complete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
