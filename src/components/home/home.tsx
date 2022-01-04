import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { BrowserFooter } from 'src/components/home/BrowserFooter';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import BetaOptions from 'src/components/login/beta/BetaOptions';

export const Home = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 30,
        color: colors.text,
    } as TextStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const textViewStyle = {
        width: isDesktopBrowser() ? "60%" : "95%"
    } as ViewStyle;

    return (
        <Screen>
            <View style={{ width: "100%", flex: 10000, justifyContent: "center", alignItems: "flex-start" }}>
                <View style={{ width: "100%", height: 600, justifyContent: "center", alignContent: "center", alignItems: "center" }}>

                    <View style={{ alignItems: "center", flex: 4 }}>
                        <Text style={headerTextStyle}>embtr.</Text>
                    </View>

                    <View style={{ alignItems: "center", flex: 8 }}>
                        <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                    </View>

                    <View style={[textViewStyle, { flex: 3 }]} />

                    <View style={[textViewStyle, { flex: 4 }]}>
                        <Text style={[textStyle, { textAlign: 'center' }]}>
                            embtr is a network of people achieving their wildest dreams. together.
                        </Text>
                    </View>

                    <View style={[textViewStyle, { alignItems: "center", flex: 5 }]}>
                        <BetaOptions />
                    </View>

                </View>
            </View>

            {isDesktopBrowser() &&
                <View style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}>
                    <BrowserFooter />
                </View>
            }
        </Screen>
    );
};