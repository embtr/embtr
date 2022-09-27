import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CALENDAR_TIME_INDICATOR_DOT_SIZE } from 'src/util/constants';

interface Props {
    height: number
}

export const TimeIndicatorDot = ( { height } : Props ) => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: "row", zIndex: 2, position: "absolute", marginTop: height - (CALENDAR_TIME_INDICATOR_DOT_SIZE / 2), width: "100%" }}>
            <View style={{ width: 41, alignContent: "flex-end", alignItems: "flex-end", paddingRight: 5 }}>
                <View style={{ backgroundColor: colors.today_calendar_time_indicator, width: CALENDAR_TIME_INDICATOR_DOT_SIZE, height: CALENDAR_TIME_INDICATOR_DOT_SIZE, borderRadius: 50 }} />
            </View>

            <View style={{ position: "absolute", zIndex: 4, width: 41, alignContent: "flex-end", alignItems: "flex-end", paddingRight: 7.4, paddingTop: 2.6 }}>
                <View style={{ borderColor: colors.background, borderWidth: 1.6, width: CALENDAR_TIME_INDICATOR_DOT_SIZE - 5, height: CALENDAR_TIME_INDICATOR_DOT_SIZE - 5, borderRadius: 50 }} />
            </View>
        </View>

    );
};