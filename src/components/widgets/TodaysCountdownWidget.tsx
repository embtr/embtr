import { Text, View } from 'react-native';
import { getLocalDayOfWeek } from 'src/controller/planning/TaskController';
import { Countdown } from '../common/time/Countdown';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export const TodaysCountdownWidget = () => {
    const { colors } = useTheme();
    const [date, setDate] = React.useState(new Date());

    const day = getLocalDayOfWeek(date);
    const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1);

    const dateString = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });

    useFocusEffect(
        React.useCallback(() => {
            setDate(new Date());
        }, [])
    );

    return (
        <WidgetBase>
            <View>
                <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM, fontSize: 16 }}>
                    Happy
                    <Text style={{ color: colors.accent_color_light }}> {dayCapitalized}</Text>{' '}
                    {dateString}!
                </Text>

                <View style={{ paddingTop: PADDING_SMALL / 2, flexDirection: 'row' }}>
                    <Countdown />
                </View>
            </View>
        </WidgetBase>
    );
};
