import React from 'react';
import { View, Text } from 'react-native';
import { GoalTaskCompleteIcon } from 'src/components/plan/goals/GoalTaskCompleteIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';



export const GoalTask = () => {
    const { colors } = useTheme();

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ backgroundColor: colors.button_background, borderRadius: 15, width: "95%", height: 65, flexDirection: "row", alignContent: "center", alignItems: "center" }}>
            <View style={{ paddingLeft: 10 }}>
                <GoalTaskCompleteIcon />
            </View>

            <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12 }}>Task name</Text>
                <Text style={{ opacity: .75, fontFamily: "Poppins_400Regular", fontSize: 10, paddingLeft: 1 }}>May 20, 2022</Text>
            </View>
        </View>
    );
};