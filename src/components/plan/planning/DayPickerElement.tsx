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

export const MemoizedDayPickerElement = React.memo(
    ({ item, index, isSelected, itemWidth, onSelectionChange }: Props) => {
        return (
            <DayPickerElement
                item={item}
                index={index}
                isSelected={isSelected}
                itemWidth={itemWidth}
                onSelectionChange={onSelectionChange}
            />
        );
    },
    (prevProps, nextProps) => {
        return prevProps.isSelected === nextProps.isSelected;
    }
);

export const DayPickerElement = ({
    item,
    index,
    isSelected,
    itemWidth,
    onSelectionChange,
}: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity style={{ width: itemWidth }} onPress={() => onSelectionChange(index)}>
            <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    <Ionicons
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
};
