import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';

interface Props {
    progress: number
}

export const ProgressBar = ({ progress }: Props) => {
    const { colors } = useTheme();

    let [fontsLoaded] = useFonts({
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    const percentRemaining = progress === Number.POSITIVE_INFINITY ? 100 : progress;

    const percentProgess = "" + percentRemaining + "%";

    return (
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }} >
            <View style={{ height: 6, flex: 5, backgroundColor: colors.goal_progress_bar, borderRadius: 10 }}>
                <View style={{ height: 6, width: percentProgess, backgroundColor: "green", borderRadius: 10 }}>
                </View>
            </View>

            <View style={{ flex: 1, height: 12 }} >
                <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 11, textAlign: "center", color: "green" }}> {percentProgess} </Text>
            </View>
        </View>

    );
};