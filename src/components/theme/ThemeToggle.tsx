import * as React from 'react';
import { EmbtrToggle } from 'src/components/common/toggle/EmbtrToggle';
import { useTheme } from 'src/components/theme/ThemeProvider';


export const ThemeToggle = () => {
    const { setScheme, isDark } = useTheme();

    const onToggle = (active: boolean) => {
        active ? setScheme('dark') : setScheme('light')
    }

    return (
        <EmbtrToggle text={"Dark Mode"} onToggle={onToggle} value={isDark} />
    );
}