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
            <View style={{ width: "100%", flex: 10000, justifyContent: "center", alignItems: "flex-start" }}>
                <View style={{ width: "100%", height: 600, justifyContent: "center", alignContent: "center", alignItems: "center" }}>

                    <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                        <View>
                            <Image source={require('assets/logo_text.png')} style={{ width: 150, height: 50 }} />
                        </View>
                    </View>

                    <View style={{ alignItems: "center", flex: 2, justifyContent: "center" }}>
                        <View>
                            <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                        </View>
                    </View>

                    <View style={[textViewStyle, { flex: 1, justifyContent: "center" }]}>
                        <Text style={textStyle}>
                            A network of people achieving their wildest dreams.
                        </Text>
                        <Text style={textStyle}>
                            together.
                        </Text>
                    </View>

                    {registrationStatus !== "invalid" && <View style={[betaRequestStatusViewStyle, { flex: 1, justifyContent: "center" }]}>
                        <LandingBetaStatus registrationStatus={registrationStatus} />
                    </View>}

                    {registrationStatus === "invalid" &&
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <View style={{ width: 150 }}>
                                <FirebaseAuthenticate buttonText="Beta Access" callback={onAuthenticated} />
                            </View>
                        </View>
                    }
                </View>
            </View>

            {isDesktopBrowser() &&
                <View style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}>
                    <LandingFooter />
                </View>
            }
        </Screen>
    );
};