
import * as React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

interface Props {
    children: React.ReactElement | React.ReactElement[],
    menuItems: MenuItemProps[],
    longPress?: boolean
}

export const EmbtrMenuMobile = ({ children, menuItems, longPress }: Props) => {
    return (
        <HoldItem activateOn={longPress === true ? 'hold' : 'tap'} items={menuItems} children={children} />
    )
}