import React from 'react';

import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
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

    const minimumIosVersion = MetadataCustomHooks.useMinimumIosVersion();
    const minimumAndroidVersion = MetadataCustomHooks.useMinimumAndroidVersion();
    const latestIosVersion = MetadataCustomHooks.useLatestIosVersion();
    const latestAndroidVersion = MetadataCustomHooks.useLatestAndroidVersion();
    const minimumAppVersion = isIosApp() ? minimumIosVersion : minimumAndroidVersion;
    const latestAppVersion = isIosApp() ? latestIosVersion : latestAndroidVersion;

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
                        We've made Embtr better!
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
                            }}
                        >
                            Update now to get the latest features.
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
                        onPress={onUpdatePressed}
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
                            {`to the ${isIosApp() ? 'app store!' : 'play store!'}`}
                        </Text>
                    </TouchableOpacity>
                </View>

                {!isRequired && (
                    <View
                        style={{
                            width: '100%',
                            paddingTop: PADDING_LARGE / 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onMaybeLater}
                            style={{
                                marginHorizontal: PADDING_LARGE,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_MEDIUM,
                                    paddingVertical: PADDING_LARGE / 2,
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
