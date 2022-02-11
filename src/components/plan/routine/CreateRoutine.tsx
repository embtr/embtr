import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const CreateRoutine = () => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#00FF00" }}>CREATE ROUTINE PAGE</Text>
        </View>
    );
};