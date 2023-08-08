import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text } from 'react-native';

interface Props {
    icon: any;
    size: number;
    focused: boolean;
}

export const TabElement = ({ icon, size, focused }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Ionicons
                name={icon}
                size={size}
                color={focused ? colors.accent_color : colors.tab_unselected}
            />
        </View>
    );
};
