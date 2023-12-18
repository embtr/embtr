import * as React from 'react';
import { Text, TextStyle, Image, View } from 'react-native';
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
                            {isIosApp() && (
                                <View style={{ width: 300, height: 45 }}>
                                    <AppleAuthenticate />
                                </View>
                            )}

                            <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />

                            <View style={{ width: 300, height: 45 }}>
                                <FirebaseAuthenticate buttonText="Login With Google" />
                            </View>

                            <View style={{ height: TIMELINE_CARD_PADDING / 2 }} />

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

                            <Text
                                style={{
                                    color: colors.text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_REGULAR,
                                    paddingTop: 20,
                                }}
                            >
                                New to embtr? Sign up.
                            </Text>
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
                    </View>
                </View>
            </View>
        </Screen>
    );
};
