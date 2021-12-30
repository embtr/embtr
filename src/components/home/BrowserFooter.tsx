import * as React from 'react';
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useTheme } from "src/components/theme/ThemeProvider";
import * as Linking from 'expo-linking';

type aboutScreenProp = StackNavigationProp<RootStackParamList, 'About'>;
type releaseNotesScreenProp = StackNavigationProp<RootStackParamList, 'ReleaseNotes'>;

export const BrowserFooter = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<aboutScreenProp | releaseNotesScreenProp>();

    const footerStyle = {
        width: '100%',
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: colors.background_secondary,
    } as ViewStyle;

    const footerTextStyle = {
        fontSize: 12,
        color: colors.text,
    } as TextStyle;

    return (
        <View style={[footerStyle, { flexDirection: "row" }]}>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 }}><Text style={[footerTextStyle, { textAlign: "right" }]} onPress={() => { navigation.navigate('About') }}>about</Text></View>
                    <View style={{ flex: 1 }}><Text style={[footerTextStyle, { textAlign: "center" }]} onPress={() => { navigation.navigate('ReleaseNotes') }}>release notes</Text></View>
                    <View style={{ flex: 1 }}><Text style={[footerTextStyle, { textAlign: "left" }]} onPress={() => { Linking.openURL('mailto:brent@embtr.com') }}>contact</Text></View>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={[footerTextStyle, { textAlign: "right" }]}>v{Constants.manifest!.version} </Text>
            </View>
        </View>
    )
}