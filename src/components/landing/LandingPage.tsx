import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { UserCredential } from 'firebase/auth';
import UserController from 'src/controller/user/UserController';
import { LandingFooter } from 'src/components/landing/LandingFooter';
import { LandingBetaStatus } from 'src/components/landing/LandingBetaStatus';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getAccessLevel, setAccessLevel } from 'src/redux/user/GlobalState';
import MailController from 'src/controller/mail/MailController';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { POPPINS_REGULAR } from 'src/util/constants';
import { EmbtrButton } from '../common/button/EmbtrButton';
import { LoginModal } from '../login/LoginModal';
import { ModalContainingComponent } from '../common/modal/ModalContainingComponent';
import { RegisterModal } from '../login/RegisterModal';

export const LandingPage = () => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    } as TextStyle;

    const betaRequestStatusViewStyle = {
        width: '95%',
    } as ViewStyle;

    const textViewStyle = {
        width: isDesktopBrowser() ? '60%' : '95%',
    } as ViewStyle;

    const [registrationStatus, setRegistrationStatus] = React.useState('invalid');
    const [displayLoginModal, setDisplayLoginModal] = React.useState(false);
    const [displayRegisterModal, setDisplayRegisterModal] = React.useState(false);

    const dispatch = useAppDispatch();
    const accessLevel = useAppSelector(getAccessLevel);

    const onAuthenticated = (userCredential: UserCredential) => {
        if (userCredential?.user?.uid && userCredential?.user?.email) {
            UserController.getAccessLevel(userCredential.user.uid, userCredential.user.email, (accessLevel: string) => {
                if (accessLevel) {
                    dispatch(setAccessLevel(accessLevel));

                    if (accessLevel === 'initial_beta_pending') {
                        MailController.sendWelcomeToBetaMail(userCredential.user.email!);
                    }

                    if (accessLevel !== 'beta_approved') {
                        setRegistrationStatus(accessLevel);
                    }
                } else {
                    setRegistrationStatus('error_data');
                }
            });
        } else {
            setRegistrationStatus('error_auth');
        }
    };

    const shouldDisplayLoadingPage = () => {
        return accessLevel === 'beta_approved' && registrationStatus === 'invalid';
    };

    if (shouldDisplayLoadingPage()) {
        return <LoadingPage />;
    }

    const onLoginModalCancel = () => {
        setDisplayLoginModal(false);
    };

    const onLoginModalConfirm = () => {
        setDisplayLoginModal(false);
    };

    const onRegisterModalCancel = () => {
        setDisplayRegisterModal(false);
    };

    const onRegisterModalConfirm = () => {
        setDisplayRegisterModal(false);
    };

    return (
        <Screen>
            <ModalContainingComponent modalVisible={displayLoginModal || displayRegisterModal} />
            <LoginModal visible={displayLoginModal} onAuthenticated={onAuthenticated} confirm={onLoginModalConfirm} dismiss={onLoginModalCancel} />
            <RegisterModal visible={displayRegisterModal} confirm={onRegisterModalConfirm} dismiss={onRegisterModalCancel} />

            <View style={{ width: '100%', flex: 10000, justifyContent: 'center', alignItems: 'flex-start' }}>
                <View style={{ width: '100%', height: 600, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', flex: 2, justifyContent: 'center' }}>
                        <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                    </View>

                    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        <Image source={require('assets/logo_text.png')} style={{ width: 150, height: 50 }} />
                    </View>
                    <View style={[textViewStyle, { flex: 1, justifyContent: 'center' }]}>
                        <Text style={textStyle}>A community achieving their wildest dreams.</Text>
                        <Text style={textStyle}>Together.</Text>
                    </View>

                    {registrationStatus !== 'invalid' && (
                        <View style={[betaRequestStatusViewStyle, { flex: 1, justifyContent: 'center' }]}>
                            <LandingBetaStatus registrationStatus={registrationStatus} />
                        </View>
                    )}

                    {registrationStatus === 'invalid' && (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ width: 300 }}>
                                <FirebaseAuthenticate buttonText="Login With Google" callback={onAuthenticated} />
                            </View>
                            <View style={{ width: 300, paddingTop: 6 }}>
                                <EmbtrButton
                                    color={'#e300ef'}
                                    buttonText="Login With Email"
                                    callback={() => {
                                        setDisplayLoginModal(true);
                                    }}
                                />
                            </View>
                            <Text style={{ color: colors.text, textAlign: 'center', fontFamily: POPPINS_REGULAR, paddingTop: 10 }}>New here? Sign up.</Text>
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
                    )}
                </View>
            </View>

            {isDesktopBrowser() && (
                <View style={{ justifyContent: 'flex-end', flex: 1, width: '100%' }}>
                    <LandingFooter />
                </View>
            )}
        </Screen>
    );
};
