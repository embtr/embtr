import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DayPickerElementData } from 'src/model/PlanningWidget';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { CompleteResultIcon } from 'src/components/common/timeline/result_icons/CompleteResultIcon';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';

interface MemoizedProps {
    elementData: DayPickerElementData;
    isSelected: boolean;
    monthIndex: number;
    onSelect: (day: DayPickerElementData) => void;
    isToday: boolean;
}

interface Props {
    elementData: DayPickerElementData;
    isSelected: boolean;
    onSelect: (day: DayPickerElementData) => void;
    isToday: boolean;
}

const styles = StyleSheet.create({
    wordText: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: POPPINS_REGULAR,
    },
    numberText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: POPPINS_SEMI_BOLD,
    },
    underscore: {
        height: 2,
        backgroundColor: '#000',
        marginTop: 3,
    },
});

export const DAY_PICKER_ELEMENT_WIDTH = (Dimensions.get('window').width - PADDING_LARGE * 3) / 7;

export const MemoizedDayPickerElementImproved = React.memo(
    ({ elementData, isSelected, onSelect, monthIndex, isToday }: MemoizedProps) => {
        return (
            <DayPickerElementImproved
                elementData={elementData}
                isSelected={isSelected}
                onSelect={onSelect}
                isToday={isToday}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.isToday === nextProps.isToday &&
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.monthIndex === nextProps.monthIndex
        );
    }
);

export const DayPickerElementImproved = ({ elementData, isSelected, onSelect, isToday }: Props) => {
    const { colors } = useTheme();

    const isCompleted = PlannedDayCustomHooks.usePlannedDayIsComplete(elementData.dayKey);

    const textColor = isSelected
        ? colors.accent_color_light
        : colors.today_calendar_picker_unselected;
    const underscoreColor = isSelected ? colors.accent_color : colors.card_background;

    const iconAbove = isToday ? (
        <Ionicons name={'sunny-outline'} size={12} color={textColor} />
    ) : isCompleted ? (
        <CompleteResultIcon size={12} />
    ) : null;

    return (
        <TouchableOpacity
            style={{ width: DAY_PICKER_ELEMENT_WIDTH }}
            onPress={() => {
                onSelect(elementData);
            }}
        >
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 12 }}>{iconAbove}</View>
                <Text style={[styles.wordText, { color: textColor }]}>{elementData.dayShort}</Text>
                <Text style={[styles.numberText, { color: textColor }]}>
                    {elementData.displayNumber}
                </Text>
                <View style={[styles.underscore, { backgroundColor: underscoreColor }]} />
            </View>
        </TouchableOpacity>
    );
};
