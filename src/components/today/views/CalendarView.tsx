import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const CalendarView = () => {
    const { colors } = useTheme();

    let calendarView: JSX.Element[] = [];
    let ampm = "am";
    for (let i = 0; i < 2; i++) {
        for (let i = 1; i <= 12; i++) {
            calendarView.push(
                <View>
                    <View style={{paddingTop: 50}}>
                        <Text style={{ color: colors.text }}>{i}:00 {ampm}</Text>
                        <HorizontalLine />
                    </View>
                </View>
            );
        }
        ampm = "pm";
    }

    return (
        <ScrollView style={{ height: "100%" }}>
            {calendarView}
        </ScrollView>
    );
};