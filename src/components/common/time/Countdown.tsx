import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';


export const Countdown = () => {
    const { colors } = useTheme();

    const [hours, setHours] = React.useState(24 - new Date().getHours());
    const [minutes, setMinutes] = React.useState(60 - new Date().getMinutes());
    const [seconds, setSeconds] = React.useState(60 - new Date().getSeconds());

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => setSeconds(60 - new Date().getSeconds() - 1), 1000);
        }, [seconds])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (seconds == 59) {
                setMinutes(60 - new Date().getMinutes());
            }
        }, [seconds])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (minutes == 59) {
                setHours(24 - new Date().getHours());
            }
        }, [minutes])
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
            {hoursString}:{minutesString}:{secondsString}
        </Text>
    );
};