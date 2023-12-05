import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { DayPickerElement } from 'src/components/plan/planning/DayPickerElement';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DayPickerElementData } from 'src/model/PlanningWidget';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    elementData: DayPickerElementData;
    isSelected: boolean;
    onSelect: Function;
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    wordText: {
        textAlign: 'center',
        fontSize: 14,
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

export const MemoizedDayPickerElementImproved = React.memo(
    ({ elementData, isSelected, onSelect }: Props) => {
        return (
            <DayPickerElementImproved
                elementData={elementData}
                isSelected={isSelected}
                onSelect={onSelect}
            />
        );
    },
    (prevProps, nextProps) => {
        return prevProps.isSelected === nextProps.isSelected;
    }
);

export const DayPickerElementImproved = ({ elementData, isSelected, onSelect }: Props) => {
    console.log("rendering element", elementData.index)

    const { colors } = useTheme();
    const textColor = isSelected ? colors.accent_color : colors.today_calendar_picker_unselected;
    const underscoreColor = isSelected ? colors.accent_color : colors.timeline_card_background;

    return (
        <Pressable
            onPress={() => {
                onSelect(elementData.index);
            }}
        >
            <View style={styles.container}>
                <Text style={[styles.wordText, { color: textColor }]}>{elementData.day}</Text>
                <Text style={[styles.numberText, { color: textColor }]}>{elementData.index}</Text>
                <View style={[styles.underscore, { backgroundColor: underscoreColor }]} />
            </View>
        </Pressable>
    );
};
