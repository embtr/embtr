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
import { useFonts, Poppins_600SemiBold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';

export const LandingPage = () => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontFamily: "Poppins_400Regular"
    } as TextStyle;

    const betaRequestStatusViewStyle = {
        width: "95%"
    } as ViewStyle;

    const textViewStyle = {
        width: isDesktopBrowser() ? "60%" : "95%"
    } as ViewStyle;

    const [registrationStatus, setRegistrationStatus] = React.useState("invalid");

    const dispatch = useAppDispatch();
    const accessLevel = useAppSelector(getAccessLevel);

    const onAuthenticated = (userCredential: UserCredential) => {
        if (userCredential?.user?.uid && userCredential?.user?.email) {
            UserController.getAccessLevel(userCredential.user.uid, userCredential.user.email, (accessLevel: string) => {
                if (accessLevel) {
                    dispatch(setAccessLevel(accessLevel));

                    if (accessLevel === "initial_beta_pending") {
                        MailController.sendWelcomeToBetaMail(userCredential.user.email!);
                    }

                    if (accessLevel !== "beta_approved") {
                        setRegistrationStatus(accessLevel);
                    }
                } else {
                    setRegistrationStatus("error_data");
                }
            })
        } else {
            setRegistrationStatus("error_auth");
        }
    }

    const shouldDisplayLoadingPage = () => {
        return accessLevel === "beta_approved" && registrationStatus === "invalid";
    }

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <View />
    }

    if (shouldDisplayLoadingPage()) {
        return <LoadingPage />
    }

    return (
        <Screen>
            <View style={{ alignItems: "center", width: "100%", height: "100%", backgroundColor: "white", justifyContent: "center" }}>
                <View style={{width: 300, height: 300, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", borderRadius: 50}}>
                    <Image source={require('assets/logo.png')} style={{ width: 250, height: 250 }} />
                </View>
            </View>
        </Screen>
    );
};