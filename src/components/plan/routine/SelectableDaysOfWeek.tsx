import React from 'react';
import { View, Text } from 'react-native';
import { SelectableDayOfWeek } from 'src/components/plan/routine/SelectableDayOfWeek';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const SelectableDaysOfWeek = () => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"M"} selected={true} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={true} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"W"} selected={true} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={true} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"F"} selected={true} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={false} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={false} /></View>
        </View>
    );
};