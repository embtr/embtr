import React from "react";
import { View, Text, TextStyle, ViewStyle, Image } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch } from "src/redux/Hooks";
import { getAuth } from "firebase/auth";
import { setAccessLevel } from "src/redux/user/GlobalState";

export const Logout = () => {
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
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
    } as ViewStyle;

    const dispatch = useAppDispatch();

    useFocusEffect(
        React.useCallback(() => {
            getAuth().signOut();
            dispatch(setAccessLevel("invalid"));
        }, [])
    );

    return (
        <Screen>
            <View style={textViewStyle}>
                <View style={logoViewStyle}>
                    <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                </View>
                <Text>{"\n\n\n\n"}</Text>
                <Text style={textStyle}>You have logged out ✌️</Text>
            </View>
        </Screen>
    )
};