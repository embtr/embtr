import * as React from 'react';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    image?: ImageURISource,
    borderColor?: string,
    buttonText: string,
    callback: Function,
    size?: string
}

export const EmbtrButton = ({ image, borderColor, buttonText, callback, size }: Props) => {
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

    return (
        image ?
            (
                <TouchableOpacity style={containerStyle} onPress={() => { callback(); }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={[logoViewStyle, { flex: 1 }]}>
                            <Image source={image} style={{ width: 18, height: 18 }} />
                        </View>
                        <Text style={[textStyle, { flex: 9 }]}>{buttonText}</Text>
                    </View>
                </TouchableOpacity>
            ) :
            (
                <TouchableOpacity style={containerStyle} onPress={() => { callback(); }}>
                    <View>
                        <Text style={textStyle}>{buttonText}</Text>
                    </View>
                </TouchableOpacity>
            )

    );
}