import * as React from 'react';
import { StyleSheet, View } from "react-native"
import { useTheme } from 'src/components/theme/ThemeProvider';

export const HorizontalLine = () => {
    const { colors } = useTheme();

    return <View
        style={{
            borderBottomColor: "#808080",
            borderBottomWidth: StyleSheet.hairlineWidth,
        }}
    />
}
