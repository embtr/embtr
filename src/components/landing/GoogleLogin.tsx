import { TouchableOpacity, Text, View, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    onPress: Function;
}

export const GoogleLogin = ({ onPress }: Props) => {
    const { colors } = useTheme();
    const image = require('assets/google_logo.png');

    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.google_login_background,
                borderRadius: 4,
                paddingHorizontal: 16,
                shadowColor: '#000',
                height: 45,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
            }}
            onPress={() => {
                onPress();
            }}
        >
            <View
                style={{
                    flex: 1,
                }}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image source={image} style={{ width: 18, height: 18 }} />
                </View>
            </View>
            <Text
                style={{
                    marginLeft: 16,
                    fontSize: 16,
                    color: colors.google_login_text,
                    fontFamily: 'Roboto_500Medium',
                    flex: 3,
                }}
            >
                Sign in with Google
            </Text>
            <View style={{ flex: 1 }} />
        </TouchableOpacity>
    );
};
