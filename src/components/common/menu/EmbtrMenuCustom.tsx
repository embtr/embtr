import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
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
                <View key={index} style={{ backgroundColor: isAndroidDevice() ? undefined : colors.modal_background, borderRadius: 10, paddingTop: 2.5, paddingBottom: 2.5 }}>
                    {index !== -1 && <HorizontalLine />}
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
    useFocusEffect(
        React.useCallback(() => {
        setMenuCallbacks();
        }, [])
    );

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
                    <View style={{ width: 300, backgroundColor: isAndroidDevice() ? undefined : colors.modal_background, borderRadius: 10, justifyContent: "space-around" }}>
                        <Text style={{ color: colors.text, fontSize: 16, paddingTop: 15, paddingBottom: 15, textAlign: "center" }}>
                            {title}
                        </Text>
                        {menuOptionViews}
                    </View>

                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
                <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
            </View>
        </Modal>
    )
}
