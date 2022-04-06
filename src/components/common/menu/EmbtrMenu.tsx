
import * as React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

interface Props {
    children: React.ReactElement | React.ReactElement[],
    menuItems: MenuItemProps[]
}

export const EmbtrMenu = ({ children, menuItems }: Props) => {
    return (
        <HoldItem activateOn='tap' items={menuItems} children={children} />
    )
}