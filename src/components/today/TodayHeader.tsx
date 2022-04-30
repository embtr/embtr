import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const TodayHeader = () => {
    const { colors } = useTheme();
    return (
        <View style={{ }}>
            <Text style={{color: colors.text}} >stat 1</Text>
        </View>
    );
};