
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EmbtrMenuOptionCustom } from 'src/components/common/menu/EmbtrMenuOptionCustom';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    //title: string
    visible: boolean,
    dismiss: Function
}

export const EmbtrMenuCustom = ({ visible, dismiss }: Props) => {
    const { colors } = useTheme();

    const title: string = "Actions";

    return (
        visible ?
            <View style={{ position: "absolute", zIndex: 1, height: "100%", width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
                <TouchableOpacity style={{ flex: 1, width: "100%", backgroundColor: "red" }} onPress={() => { dismiss() }} />
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <TouchableOpacity style={{ flex: 1, width: "100%", backgroundColor: "yellow" }} onPress={() => { dismiss() }} />
                    <View style={{ width: 300, backgroundColor: "rgba(220,220,220,.85)", borderRadius: 15, justifyContent: "space-around" }}>
                        <Text style={{ color: colors.text, fontSize: 16, paddingTop: 15, paddingBottom: 15, textAlign: "center" }}>
                            {title}
                        </Text>
                        <EmbtrMenuOptionCustom name='menu item 1' onPress={() => { }} />
                        <EmbtrMenuOptionCustom name='menu item 2' onPress={() => { }} />
                    </View>
                    <TouchableOpacity style={{ flex: 1, width: "100%", backgroundColor: "purple" }} onPress={() => { dismiss() }} />
                </View>
                <TouchableOpacity style={{ flex: 1, width: "100%", backgroundColor: "orange" }} onPress={() => { dismiss() }} />
            </View>
            :
            <View />

    )
}