import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PushNotificationController, { PushNotificationCustomHooks } from 'src/controller/notification/PushNotificationController';

export const NotificationsDisabled = () => {
    const { colors } = useTheme();

    const canRequestPermission = PushNotificationCustomHooks.useCanRequestPermission();

    const messageText = canRequestPermission
        ? 'Your notifications are currently disabled. Please grant notification permissions to receive notifications.'
        : 'Your notifications are currently disabled. Please enable them from your settings to receive notifications.'
    const buttonText = canRequestPermission ? 'Grant Notification Permissions' : 'Visit Notification Settings';

    return (
        <TouchableOpacity>
            <View>
                <View
                    style={{
                        borderColor: '#404040',
                        backgroundColor: '#343434',
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingVertical: PADDING_SMALL,
                        paddingHorizontal: PADDING_SMALL,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: PADDING_LARGE,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    includeFontPadding: false,
                                    fontSize: 16,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Notifications Disabled
                            </Text>

                            <View style={{ flex: 1 }} />
                        </View>

                        <Text
                            style={{
                                color: colors.secondary_text,
                                paddingTop: PADDING_SMALL,
                                fontSize: 13,
                                includeFontPadding: false,
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            {messageText}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (canRequestPermission) {
                                PushNotificationController.requestPushNotificationAccess();
                            } else {
                                PushNotificationController.openNotificationsSettings();
                            }
                        }}
                    >
                        <View
                            style={{
                                height: 50 - PADDING_LARGE,
                                marginHorizontal: PADDING_LARGE,
                                marginTop: PADDING_LARGE,
                                backgroundColor: colors.accent_color,
                                justifyContent: 'center',
                                borderRadius: 3,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: colors.text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 16,
                                }}
                            >
                                {buttonText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: PADDING_SMALL }} />
                </View>
            </View>
        </TouchableOpacity>
    );
};
