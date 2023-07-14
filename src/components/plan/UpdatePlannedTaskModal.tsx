import * as React from 'react';
import { View, TouchableOpacity, Modal, Text, Pressable, Animated, TextInput } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_ICON_SIZE } from 'src/util/constants';
import { PlannedTask } from 'resources/schema';
import Slider from '@react-native-community/slider';
import { UnitUtility } from 'src/util/UnitUtility';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { getWindowHeight } from 'src/util/GeneralUtility';

interface Props {
    plannedTask: PlannedTask;
    visible: boolean;
    confirm: Function;
    dismiss: Function;
}

export const UpdatePlannedTaskModal = ({ plannedTask, visible, confirm, dismiss }: Props) => {
    const { colors } = useTheme();

    React.useEffect(() => {
        setSelectedValue(plannedTask.completedQuantity ?? 0);
    }, [plannedTask]);

    const onDismissWrapper = () => {
        setSelectedValue(plannedTask.completedQuantity ?? 0);
        dismiss();
    };

    const [selectedValue, setSelectedValue] = React.useState<number>(
        plannedTask.completedQuantity ?? 0
    );
    const [isExpanded, setIsExpanded] = React.useState(false);

    const initialHeight = 230;
    const heightValue = React.useRef(new Animated.Value(initialHeight)).current;

    const top = getWindowHeight() / 2 - 150;
    const toggleExpand = () => {
        Animated.timing(heightValue, {
            toValue: isExpanded ? initialHeight : 300, // Set the target height value to 0 or the height you want to expand to
            duration: 100, // Set the duration of the animation
            useNativeDriver: false, // Make sure to set useNativeDriver to false for layout animations
        }).start();

        setIsExpanded(!isExpanded);
    };

    const textInputRef = React.useRef<TextInput>(null);

    const handleTextInputFocus = () => {
        textInputRef.current?.setNativeProps({
            selection: { start: 0, end: selectedValue.toString().length },
        });
    };

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
                        <Animated.View
                            style={{
                                width: 300,
                                height: heightValue,
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

                                <Slider
                                    minimumValue={0}
                                    maximumValue={plannedTask.quantity}
                                    value={selectedValue}
                                    step={plannedTask.unit?.stepSize ?? 1}
                                    onValueChange={(value: number) => {
                                        setSelectedValue(value);
                                    }}
                                />
                                <TextInput
                                    keyboardType={'numeric'}
                                    ref={textInputRef}
                                    onFocus={handleTextInputFocus}
                                    value={selectedValue.toString()}
                                    onChangeText={(text) => {
                                        if (isNaN(parseInt(text))) {
                                            return;
                                        }

                                        setSelectedValue(parseInt(text));
                                    }}
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_REGULAR,
                                        textAlign: 'center',
                                        fontSize: 20,
                                        paddingTop: 10,
                                    }}
                                />
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
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                onDismissWrapper();
                                            }}
                                        >
                                            <EvilIcons
                                                name="close"
                                                size={30}
                                                color={colors.tab_selected}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 2 }} />
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                confirm(selectedValue);
                                            }}
                                        >
                                            <Ionicons
                                                name={'checkmark'}
                                                size={TIMELINE_CARD_ICON_SIZE}
                                                color={colors.link}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>

                        {/* Expand Button */}
                        {/*
                        <View
                            style={{
                                width: '100%',
                                paddingBottom: 3,
                                alignItems: 'center',
                            }}
                        >
                            <Pressable onPress={toggleExpand}>
                                <Ionicons
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={colors.secondary_text}
                                />
                            </Pressable>
                        </View>
                        */}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
