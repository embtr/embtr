import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextStyle, ViewStyle, Image, Button } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";

type homeScreenProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

export const ReleaseNotes = () => {
    const { colors } = useTheme();

    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
        textAlign: "center"
    } as TextStyle;

    const textViewStyle = {
        width: "60%",
        height: "100%",
        alignContent: "center",
        justifyContent: "center"
    } as ViewStyle;

    const navigation = useNavigation<homeScreenProp>();

    return (
        <Screen>
            <View style={textViewStyle}>
                <View style={logoViewStyle}>
                    <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 200 }} />
                </View>
                <Text>{"\n\n\n\n"}</Text>
                <Text style={textStyle}>Coming Soon</Text>
                <Text>{"\n\n\n\n"}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button title='home' onPress={() => { navigation.navigate('LandingPage') }}></Button>
                </View>
            </View>
        </Screen>
    )
};