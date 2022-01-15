import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { UserCredential } from 'firebase/auth';
import UserController from 'src/controller/user/UserController';
import { LandingFooter } from 'src/components/landing/LandingFooter';
import { LandingBetaStatus } from 'src/components/landing/LandingBetaStatus';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getAccessLevel, setAccessLevel } from 'src/redux/user/GlobalState';
import MailController from 'src/controller/mail/MailController';
import { LoadingPage } from 'src/components/landing/LoadingPage';

const REGISTRATION_STATUS_SIZE = 2;

export const LandingPage = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 30,
        color: colors.text,
    } as TextStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
        textAlign: 'center'
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

    if (shouldDisplayLoadingPage()) {
        return <LoadingPage />
    }

    return (
        <Screen>
            <View style={{ width: "100%", flex: 10000, justifyContent: "center", alignItems: "flex-start" }}>
                <View style={{ width: "100%", height: 600, justifyContent: "center", alignContent: "center", alignItems: "center" }}>

                    <View style={{ alignItems: "center", flex: 1 }}>
                        <Text style={headerTextStyle}>embtr.</Text>
                    </View>

                    <View style={{ alignItems: "center", flex: 3 }}>
                        <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                    </View>

                    <View style={[textViewStyle, { flex: 1 }]}>
                        <Text style={textStyle}>
                            embtr is a network of people achieving their wildest dreams. together.
                        </Text>
                    </View>

                    {registrationStatus !== "invalid" && <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                        <LandingBetaStatus registrationStatus={registrationStatus} />
                    </View>}

                    {registrationStatus === "invalid" &&
                        <View style={{ flexDirection: "row", flex: REGISTRATION_STATUS_SIZE }}>
                            <View style={{ flex: 1, alignItems: "center" }}>
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