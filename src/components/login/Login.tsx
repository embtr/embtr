import React from "react";
import { View, ViewStyle } from "react-native";
import LoginScreen from "./GoogleSignIn";

const container = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
} as ViewStyle;

export const Login = () => {
    return (
        <View style={container}>
            <LoginScreen />
        </View>
    )
};