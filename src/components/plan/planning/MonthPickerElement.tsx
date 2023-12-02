import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDayKey, getTodayKey } from 'src/controller/planning/PlannedDayController';
import { POPPINS_MEDIUM} from 'src/util/constants';


interface Props {
    item: any;
    index: number;
    isSelected: boolean;
    onSelectionChange: Function;
}

export const MonthPickerElement = React.forwardRef(
    ({ item, index, isSelected, onSelectionChange }: Props, ref) => {
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
            <TouchableOpacity onPress={onSelectionChangeCallback}>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        ref={numberRef}
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontFamily: POPPINS_MEDIUM,
                            color: isSelected
                                ? colors.accent_color
                                : colors.today_calendar_picker_unselected,
                        }}
                    >
                        {item}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
);
