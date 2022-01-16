import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextStyle, ViewStyle, Image, Button } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";

type landingPageScreenProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

export const About = () => {
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

    const navigation = useNavigation<landingPageScreenProp>();

    return (
        <Screen>
            <View style={textViewStyle}>
                <View style={logoViewStyle}>
                    <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 200 }} />
                </View>
                <Text>{"\n\n\n\n"}</Text>
                <Text style={textStyle}>Hey! 👋 Thanks for stopping by. We broke ground on this project on December 17, 2021.</Text>
                <Text>{"\n\n"}</Text>
                <Text style={textStyle}>embtr. is an application with the intent of grouping like-minded go-getters to push them beyond their limits of what they thought possible in life, together.</Text>
                <Text>{"\n\n"}</Text>
                <Text style={textStyle}>This is just a placeholder "About" page as we work finding better and deeper words to explain what our mission is. Please keep up to date with our progress on Twitter, or visit the Release Notes page to see what is new!</Text>
                <Text>{"\n\n\n\n"}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Button title='home' onPress={() => { navigation.navigate('LandingPage') }}></Button>
                </View>
            </View>
        </Screen>
    )
};