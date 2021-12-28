import * as React from 'react';
import { Switch } from 'react-native-switch';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { darkColors, lightColors } from 'src/theme/colorThemes';


export const ThemeToggle = () => {
    const { setScheme, isDark } = useTheme();

    const toggleScheme = () => {
        isDark ? setScheme('light') : setScheme('dark');
    }

    return (
        <Switch backgroundActive={darkColors.background_secondary} backgroundInactive={lightColors.background_secondary} activeText='🌚' inActiveText='☀️' value={isDark} onValueChange={toggleScheme} />
    );
}