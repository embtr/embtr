import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { plannedTaskIsComplete, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { CALENDAR_TIME_HEIGHT } from 'src/util/constants';


interface Props {
    plannedTask: PlannedTaskModel
}

export const GuestCalendarPlanView = ({ plannedTask }: Props) => {
    const { colors } = useTheme();

    const cardShadow = {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    }

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ top: (plannedTask.startMinute! + (CALENDAR_TIME_HEIGHT / 2)), position: "absolute" }} >
            <View style={[cardShadow, {
                minHeight: 45,
                height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
                width: 225,
                borderRadius: 6,
                backgroundColor: colors.timeline_card_background
            }]}>

                <View style={{ flexDirection: "row", width: "100%", paddingTop: 5, paddingLeft: 5 }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: colors.text, fontFamily: "Poppins_600SemiBold", fontSize: 13 }}>{plannedTask.routine.name}</Text>
                        <Text style={{ color: colors.text, fontFamily: "Poppins_400Regular", fontSize: 9 }}>{plannedTask.routine.description}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: "flex-end", paddingRight: 5 }}>
                        <Ionicons name={plannedTaskIsComplete(plannedTask) ? "checkmark-done" : "checkmark"} size={20} color={plannedTaskIsComplete(plannedTask) ? "green" : colors.secondary_text} />
                    </View>
                </View>
            </View>
        </View>
    );
};