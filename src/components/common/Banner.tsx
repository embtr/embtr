import * as React from 'react';
import { View, Text, TextStyle } from "react-native"
import { useTheme } from "src/components/theme/ThemeProvider";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import { HorizontalLine } from 'src/components/common/HorizontalLine';

interface Props {
    name: string,
    leftRoute?: string,
    leftIcon?: any
    rightRoute?: string,
    rightIcon?: any
}

export const Banner = ({ name, leftRoute, leftIcon, rightRoute, rightIcon }: Props) => {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", height: 45 }}>
                <View style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                    {leftIcon ? <Ionicons name={leftIcon} size={32} color={colors.text} onPress={() => { leftRoute === "BACK" ? navigation.goBack() : navigation.navigate(leftRoute as keyof RootStackParamList) }} /> : <View />}
                </View>

                <View style={{ flex: 2, justifyContent: "center" }}>
                    <Text style={[textStyle, { textAlign: "center", fontWeight: "bold" }]}>{name}</Text>
                </View>

                <View style={{ flexDirection: "row", flex: 1, paddingRight: 10, justifyContent: "flex-end", paddingTop: 5 }}>
                    {rightIcon ? <Ionicons name={rightIcon} size={32} color={colors.text} onPress={() => { navigation.navigate(rightRoute as keyof RootStackParamList) }} /> : <View />}
                </View>
            </View>

            <HorizontalLine />
        </View>
    )
}