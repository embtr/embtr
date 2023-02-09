import * as React from 'react';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View, Image, ImageURISource } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    image?: ImageURISource;
    icon?: any;
    buttonText: string;
    callback: Function;
    height?: number;
    color?: string;
}

export const EmbtrButton = ({ image, icon, buttonText, height, callback, color }: Props) => {
    const { colors } = useTheme();

    const containerStyle = {
        backgroundColor: color ?? colors.push_button_background,
        height: height ? height : 45,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle;

    const textStyle = {
        fontSize: 14,
        color: 'white',
        fontFamily: POPPINS_SEMI_BOLD,
    } as TextStyle;

    const logoViewStyle = {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
    } as ViewStyle;

    return image ? (
        <TouchableOpacity
            style={containerStyle}
            onPress={() => {
                callback();
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <View style={logoViewStyle}>
                    <Image source={image} style={{ width: 18, height: 18 }} />
                </View>
                <Text style={textStyle}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    ) : icon ? (
        <TouchableOpacity
            style={containerStyle}
            onPress={() => {
                callback();
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <Ionicons name={icon} size={32} color={colors.text} onPress={() => {}} />
                <Text style={[textStyle]}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity
            style={containerStyle}
            onPress={() => {
                callback();
            }}
        >
            <View>
                <Text style={textStyle}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    );
};
