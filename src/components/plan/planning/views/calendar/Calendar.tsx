import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { CALENDAR_TIME_HEIGHT } from 'src/util/constants';


export const Calendar = () => {
    const { colors } = useTheme();

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />
    }

    let calendarView: JSX.Element[] = [];
    let ampm = " AM";
    for (let i = 0; i < 2; i++) {
        for (let i = 0; i < 12; i++) {
            let time = "" + (i == 0 ? 12 : i) + ":00" + ampm;
            if (time.length == 7) {
                time = " " + time;
            }
            calendarView.push(
                <View key={time} style={{ height: 60 }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{width: 80, alignContent: "flex-end", alignItems: "center", justifyContent: "center", height: CALENDAR_TIME_HEIGHT}}>
                            <Text style={{ color: colors.secondary_text, fontSize: 12, fontFamily: "Poppins_400Regular"}}>{time}</Text>
                        </View>

                        <View style={{ flexGrow: 1, paddingRight: 18, justifyContent: "center"}}>
                            <View style={{ height: 1, width: "100%", backgroundColor: colors.today_calendar_line, opacity: .25 }} />
                        </View>
                    </View>
                </View>
            );
        }
        ampm = " PM";
    }

    return (
        <View>
            {calendarView}
        </View>
    );
};