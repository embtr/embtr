import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EmbtrMenuOptions } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuOptionCustom } from 'src/components/common/menu/EmbtrMenuOptionCustom';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getMenuOptions, setCloseMenu, setOpenMenu } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';

export const EmbtrMenuCustom = () => {
    const { colors } = useTheme();

    const [visible, setVisible] = React.useState(false);
    const [menuOptions, setMenuOptions] = React.useState<EmbtrMenuOptions>();

    const dispatch = useAppDispatch();

    const title: string = "Actions";

    let menuOptionViews: JSX.Element[] = [];
    if (menuOptions && menuOptions.uniqueIdentifier && menuOptions.options && menuOptions.options.length > 0) {
        menuOptions.options.forEach(menuOption => {
            menuOptionViews.push(
                <EmbtrMenuOptionCustom key={menuOption.name} details={menuOption} />
            );
        });
    }

    const dismiss = () => {
        setVisible(false);
    };

    const setMenuCallbacks = () => {
        dispatch(setOpenMenu(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setVisible(true);
        }));

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
        visible ?
            <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                    <View style={{ width: 300, backgroundColor: "rgba(220,220,220,.85)", borderRadius: 15, justifyContent: "space-around" }}>
                        <Text style={{ color: colors.text, fontSize: 16, paddingTop: 15, paddingBottom: 15, textAlign: "center" }}>
                            {title}
                        </Text>
                        {menuOptionViews}
                    </View>
                    <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
                </View>
                <TouchableOpacity style={{ flex: 1, width: "100%" }} onPress={() => { dismiss() }} />
            </View>
            :
            <View />
    )
}