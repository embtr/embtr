import { useTheme } from 'src/components/theme/ThemeProvider';
import { View, ViewStyle, Image } from 'react-native';

export const LoadingPage = () => {
    const { colors } = useTheme();

    const loadingPageView = {
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
    } as ViewStyle;

    return (
        <View style={loadingPageView}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ bottom: '10%' }}>
                    <Image
                        source={require('assets/logo.png')}
                        style={{ width: 200, height: 200 }}
                    />
                </View>
                <Image
                    source={require('assets/logo_text.png')}
                    style={{ width: 150, height: 50 }}
                />
            </View>

            {/* FLEX 3 BUTTONS*/}
            <View style={{ flex: 1 }}></View>
        </View>
    );
};
