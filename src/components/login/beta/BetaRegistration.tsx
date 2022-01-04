import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextStyle, Image } from "react-native";
import { Screen } from 'src/components/common/screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { EmbtrButton } from "src/components/common/button/EmbtrButton";
import { isDesktopBrowser } from "src/util/DeviceUtil";
import { BrowserFooter } from "src/components/home/BrowserFooter";
import BetaController from "src/controller/beta/BetaController";
import { FirebaseAuthenticate } from "src/components/login/google/FirebaseAuthenticate";
import { UserCredential } from "firebase/auth";

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const BetaRegistration = () => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 30,
        color: colors.text,
        textAlign: "center"
    } as TextStyle;

    const textStyle = {
        fontSize: 14,
        color: colors.secondary_border,
        textAlign: "center"
    } as TextStyle;

    const navigation = useNavigation<homeScreenProp>();

    const [registrationStatus, setRegistrationStatus] = React.useState("invalid");

    return (
        <Screen>
            <View style={{ width: "100%", flex: 1000, justifyContent: "center" }}>
                <View style={{ width: "100%", height: 600, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <Text style={[headerTextStyle, { flex: 4 }]}>Request Beta Access</Text>

                    <View style={{ alignItems: "center", flex: 8 }}>
                        <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                    </View>

                    <View style={{ flex: 3 }} />

                    {
                        //todo move to own component
                    }

                    {registrationStatus === "initial_pending" &&
                        <Text style={[textStyle, { width: "95%", flex: 4 }]}>
                            Thank you for your beta request! Please check your inbox for further steps.
                        </Text>
                    }

                    {registrationStatus === "pending" &&
                        <Text style={[textStyle, { width: "95%", flex: 4 }]}>
                            Your beta request has been previously submitted and is currently pending ✅.
                        </Text>
                    }

                    {registrationStatus === "accepted" &&
                        <Text style={[textStyle, { width: "95%", flex: 4 }]}>
                            Your beta request has been accepted 👍. Head over to the Beta Login from the Home Page.
                        </Text>
                    }

                    {registrationStatus === "denied" &&
                        <Text style={[textStyle, { width: "95%", flex: 4 }]}>
                            Beta registration is currently closed. We will send an email when we open access again.
                        </Text>
                    }

                    {registrationStatus === "error_auth" &&
                        <Text style={[textStyle, { width: "95%", flex: 4, color: "red" }]}>
                            We failed to authenticate your account. Reach out to support@embtr.com if this error continues.
                        </Text>
                    }

                    {registrationStatus === "error_data" &&
                        <Text style={[textStyle, { width: "95%", flex: 4, color: "red" }]}>
                            An error occured while requesting beta access. Reach out to support@embtr.com if this error continues.
                        </Text>
                    }

                    <View style={{ flexDirection: "row", flex: 4 }}>
                        {registrationStatus === "invalid" &&
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <FirebaseAuthenticate buttonText="Request Beta" callback={(userCredential: UserCredential) => {
                                    if (userCredential?.user?.email) {
                                        {
                                            //todo convert data to interface to enforce type
                                        }
                                        BetaController.requestBetaAccess(userCredential.user.email, (status: string) => {
                                            if (status) {
                                                setRegistrationStatus(status);
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

                        <View style={{ flex: 1, alignItems: "center" }}>
                            <EmbtrButton buttonText="Home" callback={() => { navigation.navigate('Home'); }} />
                        </View>
                    </View>

                    <View style={{ flex: registrationStatus !== "invalid" ? 1 : 5 }}></View>

                </View>
            </View>

            {isDesktopBrowser() &&
                <View style={{ justifyContent: "flex-end", flex: 1, width: "100%" }}>
                    <BrowserFooter />
                </View>
            }
        </Screen>
    )
};