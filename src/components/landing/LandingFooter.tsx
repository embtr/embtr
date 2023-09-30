import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import * as Linking from 'expo-linking';

type aboutScreenProp = StackNavigationProp<RootStackParamList, 'About'>;

export const LandingFooter = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<aboutScreenProp>();

    const footerStyle = {
        width: '100%',
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: colors.background_medium,
    } as ViewStyle;

    const footerTextStyle = {
        fontSize: 12,
        color: colors.text,
    } as TextStyle;

    return (
        <View style={[footerStyle, { flexDirection: 'row' }]}>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[footerTextStyle, { textAlign: 'right' }]}
                            onPress={() => {
                                navigation.navigate('About');
                            }}
                        >
                            about
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[footerTextStyle, { textAlign: 'left' }]}
                            onPress={() => {
                                Linking.openURL('mailto:brent@embtr.com');
                            }}
                        >
                            contact
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
