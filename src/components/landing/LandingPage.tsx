import * as React from 'react';
import { Linking, Text, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { EmbtrButton } from '../common/button/EmbtrButton';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { DesktopLandingPage } from './DesktopLandingPage';
import { AppleAuthenticate } from '../login/apple/AppleAuthenticate';
import { isIosApp } from 'src/util/DeviceUtil';
import { HorizontalLine } from '../common/HorizontalLine';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { Image } from 'expo-image';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { EnvironmentUtil } from 'src/util/EnvironmentUtil';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const canUseGoogleAuth = () => {
    return (
        process.env.EXPO_PUBLIC_AUTH_EXPO_CLIENT_ID &&
        process.env.EXPO_PUBLIC_AUTH_IOS_CLIENT_ID &&
        process.env.EXPO_PUBLIC_AUTH_ANDROID_CLIENT_ID
    );
};

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

    if (isDesktopBrowser() && !continueToDesktopBrowserLogin) {
        return (
            <DesktopLandingPage
                continueToLogin={() => {
                    setContinueToDesktopBrowserLogin(true);
                }}
            />
        );
    }

    const socialLoginOptions = (
        <View>
            <View>
                <View style={{ width: 300, height: 45 }}>
                    {isIosApp() && <AppleAuthenticate />}
                </View>

                <View style={{ height: PADDING_LARGE / 2 }} />
            </View>

            <View style={{ width: 300, height: 45 }}>
                {canUseGoogleAuth() && <FirebaseAuthenticate buttonText="Login With Google" />}
            </View>
        </View>
    );

    const alternativeLoginMethods = (
        <View>
            {EnvironmentUtil.isDevelopment() && (
                <View style={{ width: 300, paddingBottom: PADDING_SMALL }}>
                    <EmbtrButton
                        color={colors.link}
                        buttonText="Debug Login"
                        callback={() => {
                            console.log('Debug login');
                            const auth = getAuth();
                            signInWithEmailAndPassword(auth, 'brent@embtr.com', 'mononz');
                        }}
                    />
                </View>
            )}

            <View style={{ width: 300, height: 45 }}>
                <EmbtrButton
                    color={'#e300ef'}
                    height={45}
                    buttonText="Login With Email"
                    callback={() => {
                        navigation.navigate(Routes.LOGIN_MODAL);
                    }}
                />
            </View>

            <View style={{ width: 300, paddingTop: PADDING_SMALL }}>
                <EmbtrButton
                    color="#b50017"
                    buttonText="Sign Up With Email"
                    callback={() => {
                        navigation.navigate(Routes.REGISTER_MODAL);
                    }}
                />
            </View>
        </View>
    );

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

                        <View style={{ flex: 2, alignItems: 'center' }}>
                            {useAlternativeLoginMethods
                                ? alternativeLoginMethods
                                : socialLoginOptions}

                            <View
                                style={{
                                    width: getWindowWidth() * 0.9,
                                    paddingTop: PADDING_LARGE * 1.5,
                                    paddingBottom: PADDING_LARGE,
                                }}
                            >
                                <HorizontalLine />
                            </View>

                            <Text
                                onPress={() => {
                                    setUseAlternativeLoginMethods(!useAlternativeLoginMethods);
                                }}
                                style={{
                                    color: colors.link,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                {useAlternativeLoginMethods
                                    ? isIosApp()
                                        ? 'Login with social accounts'
                                        : 'Login with Google'
                                    : 'Alternative login methods'}
                            </Text>

                            <View
                                style={{
                                    width: '100%',
                                    paddingTop: PADDING_LARGE,
                                    paddingHorizontal: PADDING_LARGE,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 12,
                                        textAlign: 'center',
                                    }}
                                >
                                    By registering or logging in, you agree to our{' '}
                                    <Text
                                        onPress={() => {
                                            Linking.openURL('https://embtr.com/terms');
                                        }}
                                        style={{
                                            color: colors.accent_color,
                                            fontFamily: POPPINS_MEDIUM,
                                        }}
                                    >
                                        Terms of Service
                                    </Text>{' '}
                                    and{' '}
                                    <Text
                                        onPress={() => {
                                            Linking.openURL('https://embtr.com/privacy');
                                        }}
                                        style={{
                                            color: colors.accent_color,
                                            fontFamily: POPPINS_MEDIUM,
                                        }}
                                    >
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
