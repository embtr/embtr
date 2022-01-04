import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle, ActivityIndicator } from 'react-native';
import { Screen } from 'src/components/common/screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { BrowserFooter } from 'src/components/home/BrowserFooter';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { FirebaseAuthenticate } from 'src/components/login/google/FirebaseAuthenticate';
import { UserCredential } from 'firebase/auth';
import BetaController from 'src/controller/beta/BetaController';
import AuditLogController from 'src/controller/audit_log/AuditLogController';
import { useAppDispatch } from 'src/redux/hooks';
import { createUserObject, setUser, User } from 'src/redux/user/UserSlice';

const REGISTRATION_STATUS_SIZE = 2;

export const Home = () => {
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

    const dispatch = useAppDispatch();

    const storeUserCredential = (userCredential: UserCredential) => {
        const { uid, displayName, email, photoURL } = userCredential.user;
        const user: User = createUserObject(uid!, displayName!, email!, photoURL!);

        dispatch(setUser(user));
    };

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

                    {registrationStatus === "loading" &&
                        <View style={{flex: REGISTRATION_STATUS_SIZE }}>
                            <ActivityIndicator size="large" color="#00ff00" />
                        </View>
                    }

                    {registrationStatus === "initial_pending" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Thank you for your beta request! Please check your inbox for further steps.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "pending" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Your beta request has been previously submitted and is currently pending ✅.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "denied" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                Beta registration is currently closed. We will send an email when we open access again.
                            </Text>
                        </View>

                    }

                    {registrationStatus === "error_auth" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                We failed to authenticate your account. Reach out to support@embtr.com if this error continues.
                            </Text>
                        </View>

                    }

                    {registrationStatus === "error_data" &&
                        <View style={[betaRequestStatusViewStyle, { flex: REGISTRATION_STATUS_SIZE }]}>
                            <Text style={betaRequestStatusTextStyle}>
                                An error occured while requesting beta access. Reach out to support@embtr.com if this error continues.
                            </Text>
                        </View>
                    }

                    {registrationStatus === "invalid" &&
                        <View style={{ flexDirection: "row", flex: REGISTRATION_STATUS_SIZE }}>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <FirebaseAuthenticate buttonText="Beta Access" callback={(userCredential: UserCredential) => {
                                    console.log("in 1");
                                    if (userCredential?.user?.email) {
                                        { /* todo convert data to interface to enforce type */ }
                                        BetaController.requestBetaAccess(userCredential.user.email, (status: string) => {
                                            if (status) {
                                                if (status === "accepted") {
                                                    storeUserCredential(userCredential);
                                                    AuditLogController.addLog("login");
                                                } else {
                                                    setRegistrationStatus(status);
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
                    <BrowserFooter />
                </View>
            }
        </Screen>
    );
};