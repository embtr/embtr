import React from 'react';
import { View, Platform } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { MenuView } from 'react-native-menu-view';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

interface Props {
    children: React.ReactElement | React.ReactElement[],
    menuItems: MenuItemProps[]
}

export const EmbtrMenuWeb = ( {children, menuItems} : Props ) => {
    const { colors } = useTheme();

    // const menuItems = [
    //     { text: 'Actions', isTitle: true, onPress: () => { alert("hello!") } },
    //     { text: 'Action 1', onPress: () => { alert("action 1!") } },
    //     { text: 'Action 2', withSeparator: true, onPress: () => { } },
    //     { text: 'Action 3', isDestructive: true, onPress: () => { } },
    // ];

    return (

        <View style={{ flex: 1 }} >
            <MenuView
                title="Menu Title"
                onPressAction={({ nativeEvent }) => {
                    console.warn(JSON.stringify(nativeEvent));
                }}
                actions={[
                    {
                        title: 'title',
                        id: 'add',
                        titleColor: '#2367A2',
                        image: Platform.select({
                            ios: 'plus',
                            android: 'ic_menu_add',
                        }),
                        imageColor: '#2367A2',
                        subactions: [
                            {
                                id: 'nested1',
                                title: 'Nested action',
                                titleColor: 'rgba(250,180,100,0.5)',
                                subtitle: 'State is mixed',
                                image: Platform.select({
                                    ios: 'heart.fill',
                                    android: 'ic_menu_today',
                                }),
                                imageColor: 'rgba(100,200,250,0.3)',
                                state: 'mixed',
                            },
                            {
                                id: 'nestedDestructive',
                                title: 'Destructive Action',
                                attributes: {
                                    destructive: true,
                                },
                                image: Platform.select({
                                    ios: 'trash',
                                    android: 'ic_menu_delete',
                                }),
                            },
                        ],
                    },
                    {
                        id: 'share',
                        title: 'Share Action',
                        titleColor: '#46F289',
                        subtitle: 'Share action on SNS',
                        image: Platform.select({
                            ios: 'square.and.arrow.up',
                            android: 'ic_menu_share',
                        }),
                        imageColor: '#46F289',
                        state: 'on',
                    },
                    {
                        id: 'destructive',
                        title: 'Destructive Action',
                        attributes: {
                            destructive: true,
                        },
                        image: Platform.select({
                            ios: 'trash',
                            android: 'ic_menu_delete',
                        }),
                    },
                ]}
                shouldOpenOnLongPress={true}
            >
                <View>
                    { children }
                </View>
            </MenuView>
        </View>
    );
};