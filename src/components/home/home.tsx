import * as React from 'react';
import { Text, TextStyle, Image, TouchableOpacity, View, ViewStyle, Platform } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screen } from 'src/components/common/screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {RootStackParamList} from 'src/navigation/RootStackParamList';

type homeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;

export const Home = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<homeScreenProps>();

    const headerTextStyle = {
        fontSize: 30,
        color: colors.text,
    } as TextStyle;

    const headerViewStyle = {
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle;


    const logoViewStyle = {
        justifyContent: "center",
        alignItems: "center",
    } as ViewStyle;


    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const textViewStyle = {
        width: Platform.OS === "web" ? "60%" : "100%"
    } as ViewStyle;

    const containerStyle = {
        margin: 24,
        padding: 12,
        width: 200,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary,
        alignContent: "center",
        alignItems: "center"
    } as ViewStyle;

    console.log(process.env);
    return (
        <Screen>
            <View style={[headerViewStyle, { flex: 2 }]}>
                <Text style={headerTextStyle}>welcome to embtr.</Text>
            </View>

            <View style={[logoViewStyle, { flex: 2 }]}>
                <Image source={require('../../../assets/logo.png')} style={{ width: 200, height: 200 }} />
            </View>

            <View style={[textViewStyle, { alignContent: "center", alignItems: "center" }, { flex: 3 }]}>
                <Text style={[textStyle, { textAlign: 'center' }]}>embtr. is a network of go-getters holding eachother accountable to reach their greatest potential, together.</Text>
                <Text style={[textStyle, { textAlign: 'center' }]}>{"\n\n\n"}Want in?</Text>
                <TouchableOpacity style={containerStyle} onPress={() => navigation.navigate('Login')}>
                    <Text style={textStyle}>Join Us!</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
};