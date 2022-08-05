import * as React from 'react';
import { View, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuOptionCustom } from 'src/components/common/menu/EmbtrMenuOptionCustom';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getMenuOptions, setCloseMenu, setOpenMenu } from 'src/redux/user/GlobalState';
import { isAndroidDevice } from 'src/util/DeviceUtil';

export const EmbtrMenuCustom = () => {
    const { colors } = useTheme();

    const [visible, setVisible] = React.useState(false);
    const [menuOptions, setMenuOptions] = React.useState<EmbtrMenuOptions>();

    const dispatch = useAppDispatch();

    const title: string = "Actions";

    let menuOptionViews: JSX.Element[] = [];
    if (menuOptions && menuOptions.uniqueIdentifier && menuOptions.options && menuOptions.options.length > 0) {
        menuOptions.options.forEach((menuOption, index) => {
            menuOptionViews.push(
                <View style={{ backgroundColor: isAndroidDevice() ? undefined : colors.modal_background, borderRadius: 12, paddingTop: 2.5, paddingBottom: 2.5 }}>
                    {index !== 0 && <HorizontalLine />}
                    <Button color={menuOption.destructive === true ? "red" : undefined} title={menuOption.name} onPress={() => { menuOption.onPress() }} />
                </View>
            );
        });
    }

    const dismiss = () => {
        setVisible(false);
    };

    const setMenuCallbacks = () => {
        dispatch(setOpenMenu(() => { setVisible(true) }));
        dispatch(setCloseMenu(() => { setVisible(false) }));
    };

    React.useEffect(() => {
        setMenuCallbacks();
    }, []);

    const currentMenuOptions = useAppSelector(getMenuOptions);

    if (!menuOptions && currentMenuOptions) {
        setMenuOptions(currentMenuOptions);
    } else if (menuOptions && currentMenuOptions) {
        if (currentMenuOptions.uniqueIdentifier !== menuOptions.uniqueIdentifier) {
            setMenuOptions(currentMenuOptions);
        }
    }

    return (
        <Modal visible={visible} transparent={true} animationType={"fade"} >
            <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", alignItems: "center", justifyContent: "flex-end", backgroundColor: "rgba(000,000,000,.6)" }}>
                <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    <View style={{ width: 300, backgroundColor: isAndroidDevice() ? undefined : colors.modal_background, borderRadius: 12, justifyContent: "space-around" }}>
                        {menuOptionViews}
                    </View>

                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
                <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
            </View>
        </Modal>
    )
}