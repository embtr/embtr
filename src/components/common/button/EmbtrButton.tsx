import * as React from 'react';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

interface Props {
    image?: ImageURISource,
    icon?: any,
    buttonText: string,
    callback: Function
}

export const EmbtrButton = ({ image, icon, buttonText, callback }: Props) => {
    const { colors } = useTheme();

    const containerStyle = {
        backgroundColor: colors.push_button_background,
        height: 45,
        width: "100%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    } as ViewStyle;

    const textStyle = {
        fontSize: 14,
        color: "white",
        fontFamily: "Poppins_600SemiBold"
    } as TextStyle;

    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10
    } as ViewStyle;

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        image ? (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={[logoViewStyle, { flex: 1 }]}>
                        <Image source={image} style={{ width: 18, height: 18 }} />
                    </View>
                    <Text style={[textStyle, { flex: 9 }]}>{buttonText}</Text>
                </View>
            </TouchableOpacity>

        ) : icon ? (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); }}>
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name={icon} size={32} color={colors.text} onPress={() => { }} />
                    <Text style={[textStyle, { flex: 9 }]}>{buttonText}</Text>
                </View>
            </TouchableOpacity>

        ) : (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); }}>
                <View>
                    <Text style={textStyle}>{buttonText}</Text>
                </View>
            </TouchableOpacity>
        )

    );
}
