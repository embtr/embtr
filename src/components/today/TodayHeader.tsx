import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const TodayHeader = () => {
    const { colors } = useTheme();
    return (
        <View style={{ backgroundColor: colors.background_medium, paddingTop: 25, paddingBottom: 25 }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Completed: 1</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Remaining: 1</Text>
                <Text style={{ flex: 1, textAlign: "center", color: colors.text }} >Missed: 1</Text>
            </View>
        </View>
    );
};