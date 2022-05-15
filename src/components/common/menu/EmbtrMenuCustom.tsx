
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EmbtrMenuOption } from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuOptionCustom } from 'src/components/common/menu/EmbtrMenuOptionCustom';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    //title: string
    menuOptions: EmbtrMenuOption[],
    visible: boolean,
    dismiss: Function
}

export const EmbtrMenuCustom = ({ menuOptions, visible, dismiss }: Props) => {
    const { colors } = useTheme();

    const title: string = "Actions";

    let menuOptionViews: JSX.Element[] = [];
    menuOptions.forEach(menuOption => {
        menuOptionViews.push(
            <EmbtrMenuOptionCustom key={menuOption.name} details={menuOption} />
        );
    });

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