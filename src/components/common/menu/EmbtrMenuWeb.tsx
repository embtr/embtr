import React from 'react';
import { View, Platform } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { MenuView } from 'react-native-menu-view';
import { MenuAction } from '@react-native-menu/menu/lib/typescript/src/types';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

interface Props {
    children: React.ReactElement | React.ReactElement[],
    menuItems: MenuItemProps[]
}

export const EmbtrMenuWeb = ({ children, menuItems }: Props) => {
    const { colors } = useTheme();

    let actions: MenuAction[] = [];
    menuItems.forEach(menuItem => {
        let action: MenuAction = {
            title: menuItem.text,
            titleColor: colors.text
        };
        actions.push(action);
    });

    return (
        <View style={{ flex: 1 }} >
            <MenuView
                title="Actions"
                onPressAction={({ nativeEvent }) => {
                    console.warn(JSON.stringify(nativeEvent));
                }}
                actions={actions}
                shouldOpenOnLongPress={true}
            >
                <View>
                    {children}
                </View>
            </MenuView>
        </View>
    );
};