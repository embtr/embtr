import * as React from 'react';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from "src/navigation/RootStackParamList";

interface Props {
    image?: ImageURISource,
    icon?: any,
    borderColor?: string,
    buttonText: string,
    callback: Function,
    size?: string
}

export const EmbtrButton = ({ image, icon, borderColor, buttonText, callback, size }: Props) => {
    const { colors } = useTheme();

    const containerStyle = {
        padding: size === "small" ? 6 : 12,
        width: size === "small" ? 120 : 170,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: borderColor === "secondary" ? colors.secondary_border : colors.primary_border,
        alignContent: "center",
        alignItems: "center",
    } as ViewStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 10
    } as ViewStyle;

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        image ? (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); navigation.goBack(); }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={[logoViewStyle, { flex: 1 }]}>
                        <Image source={image} style={{ width: 18, height: 18 }} />
                    </View>
                    <Text style={[textStyle, { flex: 9 }]}>{buttonText}</Text>
                </View>
            </TouchableOpacity>

        ) : icon ? (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); navigation.goBack(); }}>
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name={icon} size={32} color={colors.text} onPress={() => { }} />
                    <Text style={[textStyle, { flex: 9 }]}>{buttonText}</Text>
                </View>
            </TouchableOpacity>

        ) : (
            <TouchableOpacity style={containerStyle} onPress={() => { callback(); navigation.goBack(); }}>
                <View>
                    <Text style={textStyle}>{buttonText}</Text>
                </View>
            </TouchableOpacity>
        )

    );
}