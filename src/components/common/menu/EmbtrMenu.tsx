
import * as React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { EmbtrMenuMobile } from 'src/components/common/menu/EmbtrMenuMobile';
import { EmbtrMenuWeb } from 'src/components/common/menu/EmbtrMenuWeb';
import { isDesktopBrowser } from 'src/util/DeviceUtil';

interface Props {
    children: React.ReactElement | React.ReactElement[],
    menuItems: MenuItemProps[]
}

export const EmbtrMenu = ({ children, menuItems }: Props) => {
    return (
        isDesktopBrowser() ?
            <EmbtrMenuWeb children={children} menuItems={menuItems} />
            :
            <EmbtrMenuMobile children={children} menuItems={menuItems} />
    )
}