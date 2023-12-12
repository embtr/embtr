import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextStyle, ViewStyle, Image, Button, ScrollView } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';

type landingPageScreenProp = StackNavigationProp<RootStackParamList, 'LandingPage'>;

export const About = () => {
    const { colors } = useTheme();

    const logoViewStyle = {
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle;

    const textStyle = {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
    } as TextStyle;

    const textViewStyle = {
        width: '40%',
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle;

    const navigation = useNavigation<landingPageScreenProp>();

    return (
        <Screen>
            <ScrollView>
                <View
                    style={{
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    <View style={textViewStyle}>
                        <View style={logoViewStyle}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={{ width: 200, height: 200 }}
                            />
                        </View>
                        <Text>{'\n\n\n\n'}</Text>
                        <Text style={textStyle}>
                            Hey! 👋 Thanks for stopping by. We broke ground on this project on
                            December 17, 2021.
                        </Text>
                        <Text>{'\n\n'}</Text>
                        <Text style={textStyle}>
                            Welcome to embtr! We have been on a life-long journey to dial in our
                            habits and maximize our daily output towards what we find most
                            important. We believe there are two core components to a highly
                            successful work process; planning and accountability. These two concepts
                            live at the core of embtr. You can think of embtr as a life organizer
                            that helps you identify and execute the most productive routines that
                            are geared towards improving the areas of life that you find most
                            important. embtr is community-based so you will be grinding alongside
                            other go-getters just like you. The community helps holds you
                            accountable and keeps you motivated. We're all on this journey together;
                            let's share our wins, our losses, and our lessons learned. The good, the
                            bad, and the ugly. These are the ingredients that make up a well
                            seasoned and highly effective individual.
                        </Text>
                        <Text>{'\n\n'}</Text>
                        <Text style={textStyle}>
                            Come on inside and see what the journey to productivity is all about!
                        </Text>
                        <Text>{'\n\n\n\n'}</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                title="home"
                                onPress={() => {
                                    navigation.navigate('LandingPage');
                                }}
                            ></Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
