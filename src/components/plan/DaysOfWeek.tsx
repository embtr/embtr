import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DaysModel } from 'src/controller/planning/TaskController';

interface Props {
    days: DaysModel
}

const unselected: string = "gray";

export const DaysOfWeek = ({ days }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: days.sunday ? colors.green_highlight : unselected }}> S </Text>
            <Text style={{ color: days.monday ? colors.green_highlight : unselected }}> M </Text>
            <Text style={{ color: days.tuesday ? colors.green_highlight : unselected }}> T </Text>
            <Text style={{ color: days.wednesday ? colors.green_highlight : unselected }}> W </Text>
            <Text style={{ color: days.thursday ? colors.green_highlight : unselected }}> T </Text>
            <Text style={{ color: days.friday ? colors.green_highlight : unselected }}> F </Text>
            <Text style={{ color: days.saturday ? colors.green_highlight : unselected }}> S </Text>
        </View>
    );
};