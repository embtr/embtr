import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CURRENT_DATE = new Date();

interface Props {
    item: any;
    index: number;
    isSelected: boolean;
    itemWidth: number;
    onSelectionChange: Function;
}

export const DayPickerElement = React.forwardRef(
    ({ item, index, isSelected, itemWidth, onSelectionChange }: Props, ref) => {
        const { colors } = useTheme();

        const dayRef = React.useRef<Text>(null);
        const numberRef = React.useRef<Text>(null);
        const underscoreRef = React.useRef<View>(null);
        const sunRef = React.useRef<any>(null);

        React.useImperativeHandle(ref, () => ({
            setSelected: () => {
                numberRef.current?.setNativeProps({
                    style: {
                        color: colors.accent_color,
                    },
                });

                dayRef.current?.setNativeProps({
                    style: {
                        color: colors.accent_color,
                    },
                });

                underscoreRef.current?.setNativeProps({
                    style: {
                        backgroundColor: colors.accent_color,
                    },
                });

                sunRef.current?.setNativeProps({
                    style: {
                        color:
                            getDayKey(index + 1) === getTodayKey()
                                ? colors.accent_color
                                : colors.timeline_card_background,
                    },
                });
            },

            clearSelected: () => {
                numberRef.current?.setNativeProps({
                    style: {
                        color: colors.today_calendar_picker_unselected,
                    },
                });

                dayRef.current?.setNativeProps({
                    style: {
                        color: colors.today_calendar_picker_unselected,
                    },
                });

                underscoreRef.current?.setNativeProps({
                    style: {
                        backgroundColor: colors.timeline_card_background,
                    },
                });

                sunRef.current?.setNativeProps({
                    style: {
                        color:
                            getDayKey(index + 1) === getTodayKey()
                                ? colors.today_calendar_picker_unselected
                                : colors.timeline_card_background,
                    },
                });
            },
        }));

        const onSelectionChangeCallback = React.useCallback(() => {
            onSelectionChange(index);
        }, [index, onSelectionChange]);

        return (
            <TouchableOpacity style={{ width: itemWidth }} onPress={onSelectionChangeCallback}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons
                            ref={sunRef}
                            name={'sunny'}
                            size={10}
                            color={
                                getDayKey(index + 1) === getTodayKey()
                                    ? isSelected
                                        ? colors.accent_color
                                        : colors.today_calendar_picker_unselected
                                    : colors.timeline_card_background
                            }
                        />
                    </View>

                    <Text
                        ref={dayRef}
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: 'Poppins_400Regular',
                            color: isSelected
                                ? colors.accent_color
                                : colors.today_calendar_picker_unselected,
                        }}
                    >
                        {
                            DAYS[
                                new Date(
                                    CURRENT_DATE.getFullYear(),
                                    CURRENT_DATE.getMonth(),
                                    index % 7
                                ).getDay()
                            ]
                        }
                    </Text>
                    <Text
                        ref={numberRef}
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontFamily: 'Poppins_600SemiBold',
                            color: isSelected
                                ? colors.accent_color
                                : colors.today_calendar_picker_unselected,
                        }}
                    >
                        {item}
                    </Text>
                    <View
                        ref={underscoreRef}
                        style={{
                            marginTop: 2,
                            width: '75%',
                            height: 2,
                            backgroundColor: isSelected ? colors.accent_color : undefined,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
);
