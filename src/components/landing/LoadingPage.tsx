import * as React from 'react';
import { useTheme } from "src/components/theme/ThemeProvider";
import { View, ViewStyle } from 'react-native';

export const LoadingPage = () => {
    const { colors } = useTheme();

    const loadingPageView = {
        width: "100%",
        height: "100%",
        backgroundColor: colors.background_heavy
    } as ViewStyle;

    return <View style={loadingPageView}></View>
};