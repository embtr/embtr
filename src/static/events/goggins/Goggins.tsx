import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextStyle, ViewStyle, Image, Button, ScrollView, Linking } from "react-native";
import { Screen } from 'src/components/common/Screen';
import { useTheme } from "src/components/theme/ThemeProvider";
import { RootStackParamList } from "src/navigation/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { Banner } from "src/components/common/Banner";
import { isDesktopBrowser } from "src/util/DeviceUtil";

type landingPageScreenProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

export const Goggins = () => {
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

    const navigation = useNavigation<landingPageScreenProp>();

    return (
        <Screen>
            <Banner name={"embtr. x Goggins 4x4x48"} leftIcon={"arrow-back"} leftRoute="LandingPage" />

            <ScrollView>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={textViewStyle}>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={headerTextStyle}>Goggins 4x4x48</Text>
                        <Text>{"\n\n\n\n"}</Text>
                        <View style={logoViewStyle}>
                            <Image source={require('assets/logo.png')} style={{ width: 200, height: 200 }} />
                        </View>
                        <Text>{"\n\n\n\n"}</Text>
                        <Text style={textStyle}>On March 4, 2022, The embtr. team is joining David Goggins for his third annual 4x4x48 Challenge!{"\n\n"}</Text>
                        <Text style={textStyle}>The challenge is to run 4 miles, every 4 hours, for 48 hours. It's the ultimate challenge to test and break your mental and physical barriers. Goggins 4x4x48 is a beautiful event because you are running with thousands of others around the globe at the same time throughout the entire challenge. After each leg, you are in touch with friends, family, and other participants basking in your glory of kicking ass! You do not need to run to partake in this event. Any form of activity you deem fit is acceptable as long as you show up and perform every 4 hours for 48 hours!</Text>
                        <Text>{"\n\n"}</Text>
                        <Text style={textStyle}>This is also an amazing opportunity to raise money for a charity of our choice. We love this part! embtr. has selected our charity to be St. Jude Children's Hospital. Our charity of choice certainly needs no justification. St. Jude Children's Hospital will receive 100% of the proceeds from this event. We are offering a few forms of donation (see below).</Text>
                        <Text>{"\n\n"}</Text>
                        <Text style={textStyle}>We are respectfully challenging the embtr. community to run together for this event! This is a great opportunity to make a difference in our own lives and others' lives that need it.</Text>
                        <Text style={textStyle}>{"\n\n"}</Text>
                        <Text style={[textStyle, { textAlign: "left" }]}>Donation Options:{"\n\n"}</Text>
                        <Text style={[textStyle, { textAlign: "left" }]}>♥️ Runner - Run with the embtr. team! We ask for a donation of 30$. This donation option includes an embtr. x Goggins 4x4x48 t-shirt. <Text style={[textStyle, { color: "cyan" }]} onPress={() => { navigation.navigate('GogginsRegister') }}>Register Here</Text>.{"\n\n"}</Text>
                        <Text style={[textStyle, { textAlign: "left" }]}>♥️ Sponsorship - Individuals may sponsor runners in support of their bold quest to complete the 4x4x48 challenge. <Text style={[textStyle, { color: "cyan" }]} onPress={() => { navigation.navigate('GogginsSponsor', {}) }}>Sponsor Here</Text>.{"\n\n"}</Text>
                        <Text style={[textStyle, { textAlign: "left" }]}>♥️ General Donation - If you do not have a runner that you'd like to sponsor but still want to donate to the cause - this is the option for you. <Text style={[textStyle, { color: "cyan" }]} onPress={() => { navigation.navigate('GogginsDonate') }}>Donate Here</Text>.{"\n\n"}</Text>
                        <Text style={textStyle}>{"\n\n"}</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button title='home' onPress={() => { navigation.navigate('LandingPage') }}></Button>
                        </View>
                        <Text style={textStyle}>{"\n\n"}</Text>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    )
};