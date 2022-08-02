import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { CARD_SHADOW, SETTINGS_MENU_ITEM_WIDTH } from 'src/util/constants';


interface Props {
    text: string,
    secondaryText: any
}

export const SettingsTextElement = ({ text, secondaryText }: Props) => {
    const { colors } = useTheme();

    let [fontsLoaded] = useFonts({
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={[{ backgroundColor: colors.button_background, width: SETTINGS_MENU_ITEM_WIDTH, height: 75, borderRadius: 15, flexDirection: "row" }, CARD_SHADOW]}>

            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ color: colors.button_text, fontFamily: "Poppins_500Medium", fontSize: 15, alignItems: "flex-start", paddingLeft: 30 }}>{text}</Text>
                </View>

                <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center", paddingRight: 30 }}>
                    <Text style={{ color: colors.secondary_text, fontFamily: "Poppins_500Medium", fontSize: 15, alignItems: "flex-start", paddingLeft: 30 }}>{secondaryText}</Text>
                </View>
            </View>

        </View>
    );
}
