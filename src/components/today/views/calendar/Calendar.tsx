import React from 'react';
import { View, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Calendar = () => {
    const { colors } = useTheme();

    let calendarView: JSX.Element[] = [];
    let ampm = "am";
    for (let i = 0; i < 2; i++) {
        for (let i = 0; i < 12; i++) {
            const time = "" + (i == 0 ? 12 : i) + ":00" + ampm;
            calendarView.push(
                <View key={time} style={{ height: 60 }}>
                    <View>
                        <HorizontalLine />
                        <Text style={{ color: colors.secondary_text, fontSize: 11 }}>{time}</Text>
                    </View>
                </View>
            );
        }
        ampm = "pm";
    }

    return (
        <View>
            {calendarView}
        </View>
    );
};