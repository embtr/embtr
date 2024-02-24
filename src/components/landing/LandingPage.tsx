import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isAndroidDevice, isDesktopBrowser } from 'src/util/DeviceUtil';
import { DesktopLandingPage } from './DesktopLandingPage';
import { Image } from 'expo-image';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import Purchases, { LOG_LEVEL, PurchasesOffering } from 'react-native-purchases';

const canUseGoogleAuth = () => {
    return (
        process.env.EXPO_PUBLIC_AUTH_EXPO_CLIENT_ID &&
        process.env.EXPO_PUBLIC_AUTH_IOS_CLIENT_ID &&
        process.env.EXPO_PUBLIC_AUTH_ANDROID_CLIENT_ID
    );
};

const revenueCatIosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const revenueCatAndroidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export const LandingPage = () => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    } as TextStyle;

    const navigation = useEmbtrNavigation();

    const [continueToDesktopBrowserLogin, setContinueToDesktopBrowserLogin] = React.useState(false);
    const [useAlternativeLoginMethods, setUseAlternativeLoginMethods] = React.useState(false);

    const [currentOffering, setCurrentOffering] = React.useState<PurchasesOffering | null>(null);

    React.useEffect(() => {
        const setup = async () => {
            if (isAndroidDevice()) {
                Purchases.configure({ apiKey: revenueCatAndroidApiKey ?? '' });
            } else {
                Purchases.configure({ apiKey: revenueCatIosApiKey ?? '' });
            }

            console.log(Purchases);
            Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

            const offerings = await Purchases.getOfferings();
            console.log(offerings);
            setCurrentOffering(offerings.current);
        };

        setup().catch((e) => {
            console.log(e);
        });
    }, []);

    if (isDesktopBrowser() && !continueToDesktopBrowserLogin) {
        return (
            <DesktopLandingPage
                continueToLogin={() => {
                    setContinueToDesktopBrowserLogin(true);
                }}
            />
        );
    }

    return (
        <Screen>
            <View style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                {/* FLEX 1 LOGO */}

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <View style={{ bottom: '10%' }}>
                        <Image
                            source={require('assets/logo.png')}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                    <Image
                        source={require('assets/embtr_title.svg')}
                        style={{
                            width: 410 / 2,
                            height: 97 / 2,
                        }}
                    />
                </View>
                {currentOffering ? (
                    <View>
                        <Text>Current Offering: {currentOffering.identifier}</Text>
                        <Text>Package Count: {currentOffering.availablePackages.length}</Text>
                        {currentOffering.availablePackages.map((pkg) => {
                            return <Text>{pkg.product.identifier}</Text>;
                        })}
                    </View>
                ) : (
                    <View>
                        <Text>Current Offering: OMEGAFAIL</Text>
                    </View>
                )}

                {/* FLEX 3 BUTTONS*/}
                <View style={{ flex: 1 }}>
                    {/* FLEX 2 TEXY*/}
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={textStyle}>
                                A community achieving their wildest dreams.
                            </Text>
                            <Text style={textStyle}>Together.</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
