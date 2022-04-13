import * as React from 'react';
import { View, Text, TextStyle } from "react-native"
import { useTheme } from "src/components/theme/ThemeProvider";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { StackNavigationProp } from "@react-navigation/stack";
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { EmbtrMenu } from 'src/components/common/menu/EmbtrMenu';

interface Props {
    name: string,
    leftRoute?: string,
    leftIcon?: any,

    rightRoute?: string,
    rightIcon?: any,
    rightOnClick?: Function,
    rightIconNotificationCount?: number,

    innerLeftIcon?: any,
    innerLeftCallback?: Function

    menuItems?: MenuItemProps[]
}

export const Banner = ({ name, leftRoute, leftIcon, rightRoute, rightOnClick, rightIcon, rightIconNotificationCount, innerLeftIcon, innerLeftCallback, menuItems }: Props) => {
    const { colors } = useTheme();
    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleRightClick = () => {
        if (rightOnClick) {
            rightOnClick();
        }

        if (rightRoute) {
            navigation.navigate(rightRoute as keyof RootStackParamList);
        }
    };

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", height: 45 }}>
                <View style={{ flexDirection: "row", flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                    {leftIcon ? <Ionicons name={leftIcon} size={32} color={colors.text} onPress={() => { leftRoute === "BACK" ? navigation.goBack() : navigation.navigate(leftRoute as keyof RootStackParamList) }} /> : <View />}
                    {innerLeftIcon ? <Ionicons style={{ paddingLeft: 10 }} name={innerLeftIcon} size={32} color={colors.text} onPress={() => { if (innerLeftCallback) innerLeftCallback() }} /> : <View />}
                </View>


                <View style={{ flex: 2, justifyContent: "center" }}>
                    <Text style={[textStyle, { textAlign: "center", fontWeight: "bold" }]}>{name}</Text>
                </View>

                <View style={{ flexDirection: "row", flex: 1, paddingRight: 10, justifyContent: "flex-end", paddingTop: 5 }}>
                    {rightIcon
                        ?
                        menuItems ?
                            <EmbtrMenu menuItems={menuItems} >
                                <View style={{ alignItems: "flex-end" }}>
                                    {rightIconNotificationCount ? <View style={{ backgroundColor: colors.primary_border, zIndex: 1, position: "absolute", borderWidth: 1, borderRadius: 50, borderColor: colors.primary_border, width: 15, height: 15, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: "black", fontSize: 11 }}>{rightIconNotificationCount}</Text>
                                    </View> : <></>}
                                    <Ionicons name={rightIcon} size={32} color={colors.text} onPress={handleRightClick} />
                                </View>
                            </EmbtrMenu>
                            :
                            <View style={{ alignItems: "flex-end" }}>
                                {rightIconNotificationCount ? <View style={{ backgroundColor: colors.primary_border, zIndex: 1, position: "absolute", borderWidth: 1, borderRadius: 50, borderColor: colors.primary_border, width: 15, height: 15, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "black", fontSize: 11 }}>{rightIconNotificationCount}</Text>
                                </View> : <></>}
                                <Ionicons name={rightIcon} size={32} color={colors.text} onPress={handleRightClick} />
                            </View>
                        :
                        <View />
                    }
                </View>
            </View>

            <HorizontalLine />
        </View>
    )
}