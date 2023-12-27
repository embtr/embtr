import * as React from 'react';
import { Text, TextStyle, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { EmbtrButton } from '../common/button/EmbtrButton';
import { LoginModal } from '../login/LoginModal';
import { ModalContainingComponent } from '../common/modal/ModalContainingComponent';
import { RegisterModal } from '../login/RegisterModal';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { DesktopLandingPage } from './DesktopLandingPage';
import { AppleAuthenticate } from '../login/apple/AppleAuthenticate';
import { isIosApp } from 'src/util/DeviceUtil';
import { HorizontalLine } from '../common/HorizontalLine';
import { getWindowWidth } from 'src/util/GeneralUtility';
import { Image } from 'expo-image';

export const LandingPage = () => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    } as TextStyle;

    const [displayLoginModal, setDisplayLoginModal] = React.useState(false);
    const [displayRegisterModal, setDisplayRegisterModal] = React.useState(false);
    const [continueToDesktopBrowserLogin, setContinueToDesktopBrowserLogin] = React.useState(false);
    const [useAlternativeLoginMethods, setUseAlternativeLoginMethods] = React.useState(false);

    const onLoginModalCancel = () => {
        setDisplayLoginModal(false);
    };

    const onLoginModalConfirm = () => {
        setDisplayLoginModal(false);
    };

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

                <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />
            </View>

            <View style={{ width: 300, height: 45 }}>
                <FirebaseAuthenticate buttonText="Login With Google" />
            </View>
        </View>
    );

    const alternativeLoginMethods = (
        <View>
            <View style={{ width: 300, height: 45 }}>
                <EmbtrButton
                    color={'#e300ef'}
                    height={45}
                    buttonText="Login With Email"
                    callback={() => {
                        setDisplayLoginModal(true);
                    }}
                />
            </View>

            <View style={{ width: 300, paddingTop: 6 }}>
                <EmbtrButton
                    color="#b50017"
                    buttonText="Register With Email"
                    callback={() => {
                        setDisplayRegisterModal(true);
                    }}
                />
            </View>
        </View>
    );

    return (
        <Screen>
            <ModalContainingComponent />
            <LoginModal
                visible={displayLoginModal}
                confirm={onLoginModalConfirm}
                dismiss={onLoginModalCancel}
            />
            <RegisterModal
                visible={displayRegisterModal}
                onDismiss={() => {
                    setDisplayRegisterModal(false);
                }}
            />

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
                                    paddingTop: TIMELINE_CARD_PADDING * 1.5,
                                    paddingBottom: TIMELINE_CARD_PADDING,
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
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
};
