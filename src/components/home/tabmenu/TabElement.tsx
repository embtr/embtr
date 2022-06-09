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
        <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: colors.tab_bar_menu }}>
            <Ionicons name={icon} size={size} color={focused ? colors.tab_selected : colors.tab_unselected} />
            <Text style={{ color: focused ? colors.tab_selected : colors.tab_unselected }}>feed</Text>
        </View>
    );
};