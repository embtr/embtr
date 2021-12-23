import React from "react";
import { View, ViewStyle } from "react-native";
import { Screen } from 'src/components/common/screen';
import GoogleSignIn from "src/components/login/GoogleSignIn";

const container = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
} as ViewStyle;

export const Login = () => {
    return (
        <Screen>
            <View style={container}>
                <GoogleSignIn />
            </View>
        </Screen>

    )
};