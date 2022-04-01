import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';


export const Countdown = () => {
    const { colors } = useTheme();

    const [date, setDate] = React.useState(new Date());
    const [hours, setHours] = React.useState(24 - new Date().getHours());
    const [minutes, setMinutes] = React.useState(60 - new Date().getMinutes());
    const [seconds, setSeconds] = React.useState(60 - new Date().getSeconds());

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                setDate(new Date());
            }, 900);
        }, [date, seconds, minutes, hours])
    );

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                setSeconds(60 - date.getSeconds() - 1)
                setMinutes(60 - date.getMinutes());
                setHours(24 - date.getHours());
            }, 900);
        }, [date])
    );

    let secondsString = "" + seconds;
    if (secondsString.length === 1) {
        secondsString = "0" + secondsString;
    }

    let minutesString = "" + minutes;
    if (minutesString.length == 1) {
        minutesString = "0" + minutes;
    }

    let hoursString = "" + hours;

    return (
        <Text style={{ color: colors.text, textAlign: "center", fontSize: 10, paddingTop: 2 }}>
            {hoursString}h {minutesString}m {secondsString}s
        </Text>
    );
};