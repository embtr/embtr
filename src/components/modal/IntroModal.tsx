import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { MainTabScreens, Routes } from 'src/navigation/RootStackParamList';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';

export const IntroModal = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    const onLetsGo = () => {
        navigation.popToTop();
        navigation.navigate('JourneyTab', { screen: Routes.JOURNEY });
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: 'center',
            }}
        >
            <View style={{ flex: 0.125 }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Image source={require('assets/logo.png')} style={{ width: 150, height: 150 }} />
                <View>
                    <Text
                        style={{
                            paddingTop: PADDING_LARGE,
                            color: colors.text,
                            textAlign: 'center',
                            fontSize: 24,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        Getting Started
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop: PADDING_LARGE,
                        paddingHorizontal: PADDING_LARGE,
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 14,
                                textAlign: 'center',
                            }}
                        >
                            To ensure you are off to a great start with Embtr, we have created a
                            checklist for you to complete. This will help show you around the app
                            and get you started on your journey to better habits.
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: '100%',
                        paddingTop: PADDING_LARGE * 2,
                    }}
                >
                    <TouchableOpacity
                        onPress={onLetsGo}
                        style={{
                            marginHorizontal: PADDING_LARGE,
                            backgroundColor: colors.accent_color,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                textAlign: 'center',
                                fontFamily: POPPINS_MEDIUM,
                                paddingVertical: PADDING_LARGE / 2,
                            }}
                        >
                            Let's Go!
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
