import * as React from 'react';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    image?: ImageURISource,
    buttonText: string,
    callback: Function,
}

export const EmbtrButton = ({ image, buttonText, callback }: Props) => {
    const { colors } = useTheme();

    const containerStyle = {
        margin: 10,
        padding: 12,
        width: 170,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary_border,
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