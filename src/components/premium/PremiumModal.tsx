import React from 'react';

import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { Banner } from '../common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { RevenueCat } from 'src/controller/revenuecat/RevenueCat';
import UserController from 'src/controller/user/UserController';

export const PremiumModal = () => {
    const { colors } = useTheme();

    const navigation = useEmbtrNavigation();

    const executePurchase = async () => {
        const isPremium = await RevenueCat.isPremium();
        if (!isPremium) {
            await RevenueCat.purchasePremium();
        }

        await UserController.refreshPremiumStatus();
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
            <Banner
                leftText="close"
                name=""
                leftOnClick={() => {
                    navigation.goBack();
                }}
            />
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    {/* HEART AND TITLE */}
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={require('assets/logo.png')}
                            style={{ width: 150, height: 150 }}
                        />
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
                                Embtr Premium
                            </Text>
                        </View>
                    </View>

                    {/* PREMIUM FEATURES*/}
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                paddingTop: PADDING_LARGE * 3,
                                paddingHorizontal: PADDING_LARGE,
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    paddingLeft: PADDING_LARGE,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 14,
                                    }}
                                >
                                    Premium features include:
                                </Text>
                            </View>
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
                                    paddingLeft: PADDING_LARGE,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 14,
                                    }}
                                >
                                    ☑️ Account marked with a{' '}
                                    <Text
                                        style={{
                                            color: colors.accent_color_light,
                                            fontFamily: POPPINS_MEDIUM,
                                        }}
                                    >
                                        Premium Emblem
                                    </Text>{' '}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* PURCHASE BUTTON*/}
                    <View style={{ width: '100%', paddingBottom: PADDING_LARGE * 4 }}>
                        <Text>$3.99 per month, cancel anytime</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                executePurchase();
                            }}
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
                                    top: 2,
                                }}
                            >
                                Continue
                            </Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                width: '100%',
                                paddingTop: PADDING_LARGE,
                                paddingHorizontal: PADDING_LARGE,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}
                            >
                                <Text
                                    onPress={() => {
                                        Linking.openURL('https://embtr.com/terms');
                                    }}
                                    style={{
                                        color: colors.accent_color,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    Terms of Service
                                </Text>{' '}
                                —{' '}
                                <Text
                                    onPress={() => {
                                        Linking.openURL('https://embtr.com/privacy');
                                    }}
                                    style={{
                                        color: colors.accent_color,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
