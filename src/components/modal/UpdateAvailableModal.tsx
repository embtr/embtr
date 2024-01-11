import React from 'react';

import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens } from 'src/navigation/RootStackParamList';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';
import Constants from 'expo-constants';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';
import { Screen } from 'src/components/common/Screen';
import { isIosApp } from 'src/util/DeviceUtil';
import { useAppDispatch } from 'src/redux/Hooks';
import { setAcknowledgedVersion } from 'src/redux/user/GlobalState';

export const UpdateAvailableModal = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();
    const dispatch = useAppDispatch();

    const minimumAppVersion = MetadataCustomHooks.useMinimumAppVersion();
    const latestAppVersion = MetadataCustomHooks.useLatestAppVersion();
    const currentVersion = Constants.expoConfig?.version ?? '0.0.0';

    if (!minimumAppVersion.data || !latestAppVersion.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const onUpdatePressed = () => {
        UpdateUtility.navigateToAppStore();
    };

    const onMaybeLater = () => {
        acknowledgeVersion();
        navigation.goBack();
    };

    const acknowledgeVersion = () => {
        if (!latestAppVersion.data) {
            return;
        }

        dispatch(setAcknowledgedVersion(latestAppVersion.data));
    };

    const isRequired = UpdateUtility.updateIsAvailable(currentVersion, minimumAppVersion.data);
    const requiredText = 'This is a required update.';

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
                            paddingTop: TIMELINE_CARD_PADDING,
                            color: colors.text,
                            textAlign: 'center',
                            fontSize: 24,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        We've made Embtr better!
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
                            }}
                        >
                            Update now to get the latest features.
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        width: '100%',
                        paddingTop: TIMELINE_CARD_PADDING * 2,
                    }}
                >
                    <TouchableOpacity
                        onPress={onUpdatePressed}
                        style={{
                            marginHorizontal: TIMELINE_CARD_PADDING,
                            backgroundColor: colors.accent_color,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                textAlign: 'center',
                                fontFamily: POPPINS_MEDIUM,
                                paddingVertical: TIMELINE_CARD_PADDING / 2,
                            }}
                        >
                            {`to the ${isIosApp() ? 'app store!' : 'play store!'}`}
                        </Text>
                    </TouchableOpacity>
                </View>

                {!isRequired && (
                    <View
                        style={{
                            width: '100%',
                            paddingTop: TIMELINE_CARD_PADDING / 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onMaybeLater}
                            style={{
                                marginHorizontal: TIMELINE_CARD_PADDING,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_MEDIUM,
                                    paddingVertical: TIMELINE_CARD_PADDING / 2,
                                }}
                            >
                                maybe later
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};
