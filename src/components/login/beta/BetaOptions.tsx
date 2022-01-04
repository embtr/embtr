import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { TouchableOpacity, ViewStyle, Text, TextStyle, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';

type betaRegistrationScreenProp = StackNavigationProp<RootStackParamList, 'BetaRegistration'>;

WebBrowser.maybeCompleteAuthSession();

export default function BetaOptions() {
    const { colors } = useTheme();

    const containerStyle = {
        margin: 10,
        padding: 12,
        borderRadius: 4,
        borderWidth: 2,
        width:200,
        alignContent: "center",
        alignItems: "center"
    } as ViewStyle;

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<betaRegistrationScreenProp>();

    return (
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems:"center" }}>
                <TouchableOpacity style={[containerStyle, { borderColor: colors.primary_border }]} onPress={() => { navigation.navigate('BetaRegistration'); }}>
                    <Text style={textStyle}>Request Beta Access</Text>
                </TouchableOpacity>
            </View>

            {
            //<View style={{ flex: 1, alignItems:"center" }}>
            //    <TouchableOpacity style={[containerStyle, { borderColor: colors.secondary_border }]} onPress={() => { alert("login!"); }}>
            //        <Text style={textStyle}>Login To Beta</Text>
            //    </TouchableOpacity>
            //</View>
            }
        </View>
    );
}