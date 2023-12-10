import { ViewStyle, Text, TextStyle, View, Image, ImageURISource, Pressable } from 'react-native';
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
        backgroundColor: color ?? colors.accent_color,
        height: height ? height : 45,
        width: '100%',
        borderRadius: 5,
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
        <Pressable
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
        </Pressable>
    ) : icon ? (
        <Pressable
            style={containerStyle}
            onPress={() => {
                callback();
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <Ionicons name={icon} size={32} color={colors.text} onPress={() => {}} />
                <Text style={[textStyle]}>{buttonText}</Text>
            </View>
        </Pressable>
    ) : (
        <Pressable
            style={containerStyle}
            onPress={() => {
                callback();
            }}
        >
            <View>
                <Text style={textStyle}>{buttonText}</Text>
            </View>
        </Pressable>
    );
};
