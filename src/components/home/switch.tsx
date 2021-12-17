import * as React from 'react';
import { Switch } from 'react-native-elements';
import { useTheme } from '../theme/ThemeProvider';


export const Switchh = () => {
    const { setScheme, isDark } = useTheme();

    const toggleScheme = () => {
        isDark ? setScheme('light') : setScheme('dark');
    }

    return (
        <>
            <Switch value={isDark} onValueChange={toggleScheme} />
        </>
    );
}