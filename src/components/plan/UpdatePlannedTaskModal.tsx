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
import { getWindowHeight } from 'src/util/GeneralUtility';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

interface Props {
    plannedTask: PlannedTask;
    visible: boolean;
    skip: Function;
    complete: Function;
    update: Function;
    fail: Function;
    dismiss: Function;
    remove: Function;
}

export const UpdatePlannedTaskModal = ({
    plannedTask,
    visible,
    skip,
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

    const closeAll = () => {
        Keyboard.dismiss();

        setMenuVisible(false);
        setKeyboardFocused(false);
        setInputWasFocused(false);
    };

    const onRemove = () => {
        closeAll();
        remove();
    };

    const onEdit = () => {
        closeAll();
        dismiss(plannedTask.scheduledHabitId);
    };

    const onSkip = () => {
        closeAll();
        skip();
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

    const unitsPretty = plannedTask.unit
        ? UnitUtility.getReadableUnit(plannedTask.unit, 2)
        : 'Times';
    const timeOfDayPretty = TimeOfDayUtility.getTimeOfDayPretty(plannedTask.timeOfDay);

    const body = (
        <View>
            {/* HEADER */}
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingLeft: TIMELINE_CARD_PADDING,
                    paddingTop: TIMELINE_CARD_PADDING,
                }}
            >
                <View style={{ width: 20, height: 20 }}>
                    <SvgUri width={20} height={20} uri={plannedTask.iconUrl ?? ''} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 18,
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

            {/* UNIT & QUANTITY SECTION */}
            <View
                style={{
                    marginTop: TIMELINE_CARD_PADDING * 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <View
                    style={{ flexDirection: 'row', flex: 1, height: '100%', alignItems: 'center' }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            paddingLeft: TIMELINE_CARD_PADDING,
                            fontFamily: POPPINS_REGULAR,
                            textAlign: 'center',
                            fontSize: 18,
                        }}
                    >
                        {unitsPretty}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            paddingHorizontal: TIMELINE_CARD_PADDING / 2,
                        }}
                    >
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
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: colors.secondary_text,
                            borderWidth: 1,
                            borderRadius: 5,
                            flex: 1,
                        }}
                    >
                        <TextInput
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                textAlign: 'center',
                                fontSize: 18,
                                paddingVertical: TIMELINE_CARD_PADDING / 2,
                            }}
                            numberOfLines={1}
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

                                setSelectedValue(text.length === 0 ? null : parseInt(text));
                            }}
                        />
                        <View
                            style={{
                                zIndex: 1,
                                position: 'absolute',
                                bottom: -5.5,
                                backgroundColor: colors.modal_background,
                                right: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    fontSize: 10,
                                    paddingRight: 5,
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: 2.5,
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            (selectedValue ?? 0) >= (plannedTask.quantity ?? 0)
                                                ? colors.progress_bar_complete
                                                : colors.accent_color,
                                    }}
                                >
                                    Goal: {plannedTask.quantity}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            alignItems: 'center',
                            paddingHorizontal: TIMELINE_CARD_PADDING / 2,
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
            </View>

            {/* UNIT & QUANTITY SECTION */}
            <View
                style={{
                    marginTop: TIMELINE_CARD_PADDING * 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <View
                    style={{ flexDirection: 'row', flex: 1, height: '100%', alignItems: 'center' }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            paddingLeft: TIMELINE_CARD_PADDING,
                            fontFamily: POPPINS_REGULAR,
                            textAlign: 'center',
                            fontSize: 18,
                        }}
                    >
                        Time of day
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                    }}
                >
                    <View style={{ width: TIMELINE_CARD_PADDING }} />
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: colors.secondary_text,
                            borderWidth: 1,
                            borderRadius: 5,
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                textAlign: 'center',
                                fontSize: 18,
                                paddingVertical: TIMELINE_CARD_PADDING / 2,
                            }}
                            numberOfLines={1}
                            ref={textInputRef}
                        >
                            {timeOfDayPretty}
                        </Text>
                    </View>
                    <View style={{ width: TIMELINE_CARD_PADDING }} />
                </View>
            </View>

            {/* UPDATE & ADVANCED OPTIONS BUTTONS */}
            <View
                style={{
                    width: '100%',
                    paddingTop: TIMELINE_CARD_PADDING * 2,
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
                                color={colors.text}
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
                                    paddingLeft: 6,
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
                                onPress={onSkip}
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
                                    paddingRight: 6,
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
    );

    return (
        <Modal visible={visible} transparent={true} animationType={'fade'}>
            {/* <View style={{height: "100%", width: 1, backgroundColor: "yellow", zIndex: 100, position: 'absolute', right: 50}}></View> */}
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
                            width: 350,
                            backgroundColor: colors.modal_background,
                            borderRadius: 12,
                        }}
                    >
                        {body}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
