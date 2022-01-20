import React from "react";
import { View, Text, TextStyle, ViewStyle, Image, Button, ScrollView } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { Banner } from "src/components/common/Banner";
import { EditableTextBox } from "src/components/common/textbox/EditableTextBox";
import { isDesktopBrowser } from "src/util/DeviceUtil";
import EventController from "src/controller/event/EventController";
import * as Linking from 'expo-linking';

export const GogginsRegister = () => {
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
    const [address, setAddress] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [tSize, setTSize] = React.useState("");

    const submit = () => {
        if (!name) {
            alert ("please fill out the 'name' field.");
            return;
        }

        if (!address) {
            alert ("please fill out the 'address' field.");
            return;
        }

        if (!email) {
            alert ("please fill out the 'email' field.");
            return;
        }

        if (!tSize) {
            alert ("please fill out the 't-shirt' field.");
            return;
        }

        setFinished(true);

        EventController.addGogginsRegistration(name, address, email, tSize);
        Linking.openURL('https://www.paypal.com/donate/?business=WHSSVZWPHUSC2&amount=30&no_recurring=1&item_name=Embtr+x+Goggins+4x4x48+-+Runner%27s+Registration&currency_code=USD')
    };

    return (
        <Screen>
            <Banner name={"Goggins 4x4x48 - Registration"} leftIcon={"arrow-back"} leftRoute="Goggins" />
            <ScrollView>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={textViewStyle}>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={headerTextStyle}>Goggins 4x4x48 - Registration</Text>
                        <Text>{"\n\n\n\n"}</Text>
                        <View style={logoViewStyle}>
                            <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                        </View>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={textStyle}>Looking to participate in the challenge? We knew you had it in you!</Text>
                        <Text>{"\n\n"}</Text>
                        <Text style={textStyle}>Please fill out the form, click submit, and then visit the donation page hosted by PayPal. We will send you an email once your registration is complete. We look forward to completing this challenge with you!</Text>
                        <Text style={textStyle}>{"\n\n"}</Text>

                        <View style={{ alignItems: "center" }}>
                            {finished && <View>
                                <Text style={[textStyle, {color:"cyan"}]}>You are all set 🎉🎊 We will email you with event updates as we get closer March 4th. #StayHard 💪!</Text>
                            </View>}

                            { !finished && <View style={{ width: isDesktopBrowser() ? "40%" : "80%" }}>
                                <EditableTextBox placeholder="name" text={name} textSize={14} editable={true} onChangeText={setName} />
                                <EditableTextBox placeholder="address" text={address} textSize={14} editable={true} onChangeText={setAddress} />
                                <EditableTextBox placeholder="email" text={email} textSize={14} editable={true} onChangeText={setEmail} />
                                <EditableTextBox placeholder="t-shirt size" text={tSize} textSize={14} editable={true} onChangeText={setTSize} />
                            </View> }
                        </View>

                        { !finished && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button title='Submit And Head To Donation Page 💪' onPress={submit}></Button>
                        </View> }
                        <Text style={textStyle}>{"\n\n"}</Text>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )
};