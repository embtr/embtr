import React from "react";
import { View, Text, TextStyle, ViewStyle, Image, Button, ScrollView } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { Banner } from "src/components/common/Banner";
import { EditableTextBox } from "src/components/common/textbox/EditableTextBox";
import { isDesktopBrowser } from "src/util/DeviceUtil";
import EventController from "src/controller/event/EventController";
import * as Linking from 'expo-linking';
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/RootStackParamList";

export const GogginsSponsor = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'GogginsSponsor'>>();
    
    const { colors } = useTheme();

    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle;

    const headerTextStyle = {
        fontSize: 30,
        color: colors.text,
        textAlign: "center"
    } as TextStyle;

    const textStyle = {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    } as TextStyle;

    const textViewStyle = {
        width: isDesktopBrowser() ? "60%" : "95%",
        height: "100%",
        alignContent: "center",
        justifyContent: "center"
    } as ViewStyle;

    const [finished, setFinished] = React.useState(false);

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [runnerNameEmail, setRunnerNameEmail] = React.useState("");

    const submit = () => {
        if (!name) {
            alert ("please fill out the 'name' field.");
            return;
        }

        if (!email) {
            alert ("please fill out the 'email' field.");
            return;
        }

        if (!route.params?.athlete && !runnerNameEmail) {
            alert ("please fill out the 'runner name/email' field.");
            return;
        }

        setFinished(true);

        EventController.addGogginsSponsorship(name, email, route.params?.athlete ? route.params.athlete : runnerNameEmail);
        Linking.openURL('https://www.paypal.com/donate/?business=WHSSVZWPHUSC2&no_recurring=1&item_name=embtr.+x+Goggins+4x4x48+-+Sponsorship+Donation&currency_code=USD')
    };

    return (
        <Screen>
            <Banner name={"Goggins 4x4x48 - Sponsorship"} leftIcon={"arrow-back"} leftRoute="Goggins" />
            <ScrollView>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={textViewStyle}>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={headerTextStyle}>Goggins 4x4x48 - Sponsorship</Text>
                        <Text>{"\n\n\n\n"}</Text>
                        <View style={logoViewStyle}>
                            <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                        </View>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={textStyle}>You are a kind soul for donating on behalf of an athlete that's attending the Goggins 4x4x48 challenge 😇.</Text>
                        <Text>{"\n\n"}</Text>
                        <Text style={textStyle}>Please fill out the form, click submit, and then visit the donation page hosted by PayPal. We will keep you posted via email with updates on the event.</Text>
                        <Text style={textStyle}>{"\n\n"}</Text>

                        <View style={{ alignItems: "center" }}>
                            {finished && <View>
                                <Text style={[textStyle, {color:"cyan"}]}>You are all set 🎉🎊 Thank you!</Text>
                            </View>}

                            { !finished && <View style={{ width: isDesktopBrowser() ? "40%" : "80%" }}>
                                <EditableTextBox placeholder="name" text={name} textSize={14} editable={true} onChangeText={setName} />
                                <EditableTextBox placeholder="email" text={email} textSize={14} editable={true} onChangeText={setEmail} />
                                <EditableTextBox placeholder="athlete name/email" text={route.params?.athlete ? route.params?.athlete : runnerNameEmail} textSize={14} editable={true} onChangeText={setRunnerNameEmail} />
                            </View> }
                        </View>

                        { !finished && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button title='Submit And Head To Donation Page ✌️' onPress={submit}></Button>
                        </View> }
                        <Text style={textStyle}>{"\n\n"}</Text>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )
};