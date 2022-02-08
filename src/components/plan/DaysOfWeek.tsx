import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const DaysOfWeek = () => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#00FF00" }}> M </Text>
            <Text style={{ color: "#00FF00" }}> T </Text>
            <Text style={{ color: "#00FF00" }}> W </Text>
            <Text style={{ color: "#00FF00" }}> T </Text>
            <Text style={{ color: "#00FF00" }}> S </Text>
            <Text style={{ color: "gray" }}> F </Text>
            <Text style={{ color: "gray" }}> S </Text>
        </View>
    );
};