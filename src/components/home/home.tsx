import * as React from 'react';
import { Text, TextStyle, Image, View, ViewStyle } from 'react-native';
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

    const betaRequestStatusTextStyle = {
        fontSize: 14,
        color: colors.secondary_border,
        textAlign: 'center'
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

                    <View style={{ alignItems: "center", flex: 4 }}>
                        <Text style={headerTextStyle}>embtr.</Text>
                    </View>

                    <View style={{ alignItems: "center", flex: 8 }}>
                        <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                    </View>

                    <View style={[textViewStyle, { flex: 3 }]} />

                    <View style={[textViewStyle, { flex: 4 }]}>
                        <Text style={textStyle}>
                            embtr is a network of people achieving their wildest dreams. together.
                        </Text>
                    </View>

                    {
                        // todo move to own component
                    }

                    { registrationStatus === "invalid" && <View style={[betaRequestStatusTextStyle, { flex: REGISTRATION_STATUS_SIZE }]} /> }

                    {registrationStatus === "initial_pending" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE }]}>
                            Thank you for your beta request! Please check your inbox for further steps.
                        </Text>
                    }

                    {registrationStatus === "pending" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE }]}>
                            Your beta request has been previously submitted and is currently pending ✅.
                        </Text>
                    }

                    {registrationStatus === "accepted" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE }]}>
                            Your beta request has been accepted 👍. Head over to the Beta Login from the Home Page.
                        </Text>
                    }

                    {registrationStatus === "denied" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE }]}>
                            Beta registration is currently closed. We will send an email when we open access again.
                        </Text>
                    }

                    {registrationStatus === "error_auth" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE, color: "red" }]}>
                            We failed to authenticate your account. Reach out to support@embtr.com if this error continues.
                        </Text>
                    }

                    {registrationStatus === "error_data" &&
                        <Text style={[betaRequestStatusTextStyle, { width: "95%", flex: REGISTRATION_STATUS_SIZE, color: "red" }]}>
                            An error occured while requesting beta access. Reach out to support@embtr.com if this error continues.
                        </Text>
                    }

                    <View style={{ flexDirection: "row", flex: 5 }}>
                        {registrationStatus === "invalid" &&
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <FirebaseAuthenticate buttonText="Beta Access" callback={(userCredential: UserCredential) => {
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
                        }
                    </View>

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