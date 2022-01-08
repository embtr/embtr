import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { UserCredential } from 'firebase/auth';
import AuditLogController from 'src/controller/audit_log/AuditLogController';
import UserController from 'src/controller/user/UserController';
import { LandingFooter } from 'src/components/landing/LandingFooter';

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

    const betaRequestStatusTextStyle = {
        textAlign: 'center',
        fontSize: 14,
        color: colors.secondary_border
    } as TextStyle;

    const textViewStyle = {
        width: isDesktopBrowser() ? "60%" : "95%"
    } as ViewStyle;

    const [registrationStatus, setRegistrationStatus] = React.useState("invalid");

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


                    {
                        // todo move to own component
                    }

                    {registrationStatus === "initial_beta_pending" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Thank you for your beta request! Please check your inbox for further steps.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "beta_pending" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Your beta request has been previously submitted and is currently pending ✅.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "beta_denied" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Beta registration is currently closed. We will send an email when we open access again.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "error_auth" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={[betaRequestStatusTextStyle, {color:"red"} ]}>
                                We failed to authenticate your account. Reach out to support@embtr.com if this error continues.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "error_data" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={[betaRequestStatusTextStyle, {color:"red"} ]}>
                                An error occured while requesting beta access. Reach out to support@embtr.com if this error continues.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "invalid" &&
                        <View style={{ flexDirection: "row", flex: REGISTRATION_STATUS_SIZE }}>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <FirebaseAuthenticate buttonText="Beta Access" callback={(userCredential: UserCredential) => {
                                    if (userCredential?.user?.email) {
                                        { /* todo convert data to interface to enforce type */ }
                                        UserController.requestBetaAccess(userCredential.user.email, (accessLevel: string) => {
                                            if (accessLevel) {
                                                if (accessLevel === "beta_approved") {
                                                    AuditLogController.addLog("login");
                                                } else {
                                                    setRegistrationStatus(accessLevel);
                                                }
                                            } else {
                                                setRegistrationStatus("error_data");
                                            }
                                        })
                                    } else {
                                        setRegistrationStatus("error_auth");
                                    }
                                }} />
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