import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CALENDAR_TIME_INDICATOR_DOT_SIZE } from 'src/util/constants';
import { TimeIndicatorDot } from 'src/components/today/views/calendar/time_indicator/TimeIndicatorDot';
import { TimeIndicatorLine } from 'src/components/today/views/calendar/time_indicator/TimeIndicatorLine';

export const TimeIndicator = () => {
    const { colors } = useTheme();

    const [hours, setHours] = React.useState(new Date().getHours());
    const [minutes, setMinutes] = React.useState(new Date().getMinutes());


    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                setMinutes(new Date().getMinutes());
                setHours(new Date().getHours());
            }, 61000);
        }, [minutes])
    );

    const height = hours * 60 + minutes;
    return (
        <View style={{ flexDirection: "row", zIndex: 2, position: "absolute", width: "100%" }}>
            <TimeIndicatorLine height={height} />
            <TimeIndicatorDot height={height} />
        </View>
    );
};