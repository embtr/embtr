import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DayPickerElementData } from 'src/model/PlanningWidget';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface MemoizedProps {
    elementData: DayPickerElementData;
    isSelected: boolean;
    monthIndex: number;
    onSelect: (day: DayPickerElementData) => void;
}

interface Props {
    elementData: DayPickerElementData;
    isSelected: boolean;
    onSelect: (day: DayPickerElementData) => void;
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

export const DAY_PICKER_ELEMENT_WIDTH =
    (Dimensions.get('window').width - TIMELINE_CARD_PADDING * 3) / 7;

export const MemoizedDayPickerElementImproved = React.memo(
    ({ elementData, isSelected, onSelect, monthIndex }: MemoizedProps) => {
        return (
            <DayPickerElementImproved
                elementData={elementData}
                isSelected={isSelected}
                onSelect={onSelect}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.isSelected === nextProps.isSelected &&
            prevProps.monthIndex === nextProps.monthIndex
        );
    }
);

export const DayPickerElementImproved = ({ elementData, isSelected, onSelect }: Props) => {
    const { colors } = useTheme();

    const textColor = isSelected ? colors.accent_color : colors.today_calendar_picker_unselected;
    const underscoreColor = isSelected ? colors.accent_color : colors.timeline_card_background;

    return (
        <TouchableOpacity
            style={{ width: DAY_PICKER_ELEMENT_WIDTH }}
            onPress={() => {
                onSelect(elementData);
            }}
        >
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'checkmark'} size={12} color={colors.accent_color} />
                <Text style={[styles.wordText, { color: textColor }]}>{elementData.day}</Text>
                <Text style={[styles.numberText, { color: textColor }]}>
                    {elementData.displayNumber}
                </Text>
                <View style={[styles.underscore, { backgroundColor: underscoreColor }]} />
            </View>
        </TouchableOpacity>
    );
};
