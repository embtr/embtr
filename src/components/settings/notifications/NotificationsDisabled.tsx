import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PushNotificationController from 'src/controller/notification/PushNotificationController';

export const NotificationsDisabled = () => {
    const { colors } = useTheme();

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
                            Your notifications are currently disabled. Please enable them from your
                            settings to receive notifications.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            PushNotificationController.openNotificationsSettings();
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
                                Visit Notification Settings
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};
