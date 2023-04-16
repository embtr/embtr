import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Countdown = () => {
    const { colors } = useTheme();
    const [date, setDate] = React.useState(new Date());

    React.useEffect(() => {
        const timerId = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const timeLeft = React.useCallback(() => {
        const hours = 23 - date.getHours();
        const minutes = 59 - date.getMinutes();
        const seconds = 59 - date.getSeconds();
        return { hours, minutes, seconds };
    }, [date]);

    const padZero = (value: number) => {
        return value.toString().padStart(2, '0');
    };

    const { hours, minutes, seconds } = React.useMemo(() => timeLeft(), [timeLeft]);

    return (
        <Text style={{ color: colors.text, fontSize: 12, paddingTop: 2 }}>
            {padZero(hours)}h {padZero(minutes)}m {padZero(seconds)}s
        </Text>
    );
};
