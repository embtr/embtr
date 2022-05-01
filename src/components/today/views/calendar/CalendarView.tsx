import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TimeIndicator } from 'src/components/today/views/calendar/TimeIndicator';

export const CalendarView = () => {
    const { colors } = useTheme();

    const scrollRef = React.useRef<ScrollView>(null);

    let calendarView: JSX.Element[] = [];
    let ampm = "am";
    for (let i = 0; i < 2; i++) {
        for (let i = 0; i < 12; i++) {
            calendarView.push(
                <View style={{ height: 60 }}>
                    <View>
                        <HorizontalLine />
                        <Text style={{ color: colors.secondary_text, fontSize: 11 }}>{i == 0 ? 12 : i}:00 {ampm}</Text>
                    </View>
                </View>
            );
        }
        ampm = "pm";
    }

    return (
        <ScrollView ref={scrollRef} onLayout={() => { scrollRef.current?.scrollTo(60 * (new Date().getHours() - 6)) }} style={{ flex: 1 }}>
            <TimeIndicator />
            {calendarView}
        </ScrollView>
    );
};