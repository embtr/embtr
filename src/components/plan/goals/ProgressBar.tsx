import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';

interface Props {
    progress: number,
    success?: boolean
}

export const ProgressBar = ({ progress, success }: Props) => {
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
            <View style={{ flex: 5, backgroundColor: colors.progress_bar_color, borderRadius: 10 }}>
                <View style={{ height: 6, width: percentProgess, backgroundColor: success === false ? "red" : colors.progress_bar_complete, borderRadius: 10 }}>
                </View>
            </View>

            <View style={{ flex: 1 }} >
                <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 11, textAlign: "center", color: success === false ? "red" : colors.progress_bar_complete}}> {percentProgess} </Text>
            </View>
        </View>

    );
};
