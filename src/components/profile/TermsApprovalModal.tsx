import React from 'react';

import { Image, Keyboard, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens } from 'src/navigation/RootStackParamList';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { Checkbox } from 'src/components/checkbox/Checkbox';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';

export const TermsApprovalModal = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const [termsApproved, setTermsApproved] = React.useState(false);

    const termsVersion = MetadataCustomHooks.useLatestTermsVersion();
    const currentUser = UserCustomHooks.useCurrentUser();

    const agreeToTerms = async () => {
        const terms = termsVersion.data ? Number(termsVersion.data) : 0;
        const userClone = { ...currentUser.data };
        userClone.termsVersion = terms;

        const updateUserResponse = await UserController.update(userClone);
        if (!updateUserResponse) {
            return;
        }

        await UserController.invalidateCurrentUser();
        navigation.popToTop();
    };

    const formValid = !!termsVersion.data && termsApproved;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
            <View style={{ flex: 0.125 }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Image source={require('assets/logo.png')} style={{ width: 150, height: 150 }} />
                <View>
                    <Text
                        style={{
                            paddingTop: TIMELINE_CARD_PADDING,
                            color: colors.text,
                            textAlign: 'center',
                            fontSize: 24,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        Our Terms Have Changed
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop: TIMELINE_CARD_PADDING,
                        paddingHorizontal: TIMELINE_CARD_PADDING,
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <Checkbox
                        checked={termsApproved}
                        onCheck={() => {
                            setTermsApproved(!termsApproved);
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 14,
                            }}
                        >
                            By continuing, you agree to our{' '}
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
                            and{' '}
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

                <View style={{ width: '100%', paddingTop: TIMELINE_CARD_PADDING * 2 }}>
                    <TouchableOpacity
                        onPress={async () => {
                            Keyboard.dismiss();
                            await agreeToTerms();
                        }}
                        disabled={!formValid}
                        style={{
                            marginHorizontal: TIMELINE_CARD_PADDING,
                            backgroundColor: formValid
                                ? colors.accent_color
                                : colors.accent_color_dim,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: formValid ? colors.text : colors.secondary_text,
                                textAlign: 'center',
                                fontFamily: POPPINS_MEDIUM,
                                paddingVertical: TIMELINE_CARD_PADDING / 2,
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
