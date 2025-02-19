import React, { useState, useEffect, useCallback } from 'react';
import { Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';

const padZero = (value: number) => value.toString().padStart(2, '0');

export const Countdown = () => {
    const { colors } = useTheme();
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const timeLeft = useCallback(() => {
        const hours = 23 - date.getHours();
        const minutes = 59 - date.getMinutes();
        const seconds = 59 - date.getSeconds();
        return { hours, minutes, seconds };
    }, [date]);

    const { hours, minutes, seconds } = timeLeft();

    return (
        <Text
            style={{
                color: colors.text,
                fontSize: 12,
                fontFamily: POPPINS_REGULAR,
            }}
        >
            {`${hours}h ${padZero(minutes)}m ${padZero(seconds)}s`}
            <Text style={{ color: colors.accent_color_light, fontSize: 12 }}> remaining</Text>
        </Text>
    );
};
