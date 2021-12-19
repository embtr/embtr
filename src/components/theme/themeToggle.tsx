import * as React from 'react';
import { Switch } from 'react-native';
import { useTheme } from './ThemeProvider';


export const ThemeToggle = () => {
    const { setScheme, isDark } = useTheme();

    const toggleScheme = () => {
        isDark ? setScheme('light') : setScheme('dark');
    }

    return (
        <Switch value={isDark} onValueChange={toggleScheme} />
    );
}