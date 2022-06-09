import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, Text } from 'react-native';

interface Props {
    icon: any,
    size: number,
    focused: boolean
}

export const TabElement = ({ icon, size, focused }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: colors.tab_bar_menu, marginTop: 10 }}>
            <Ionicons name={icon} size={size} color={focused ? colors.tab_selected : colors.tab_unselected} />

            <View style = {{backgroundColor: focused ? colors.tab_selected : colors.tab_bar_menu, borderRadius: 50, height: 5, width: 5, marginTop: 10}} />
        </View>
    );
};