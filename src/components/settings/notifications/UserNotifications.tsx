import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { ReminderNotificationsSettings } from './reminder/ReminderNotificationsSettings';
import { SocialNotificationsSettings } from './social/SocialNotificationSettings';
import { WarningNotificationsSettings } from './warning/WarningNotificationsSettings';
import { NotificationsDisabled } from './NotificationsDisabled';
import { PushNotificationCustomHooks } from 'src/controller/notification/PushNotificationController';

export const UserNotifications = () => {
    const colors = useTheme().colors;

    const pushNotificationsEnabled = PushNotificationCustomHooks.useEnabled();

    const disabledView = pushNotificationsEnabled ? (
        <View />
    ) : (
        <View style={{ paddingTop: PADDING_LARGE }}>
            <NotificationsDisabled />
        </View>
    );

    return (
        <Screen>
            <Banner name="Notifications" leftIcon={'arrow-back'} leftRoute="BACK" />

            <ScrollView>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                            }}
                        >
                            Personalize your notification experience within embtr.
                        </Text>
                    </View>

                    {disabledView}

                    <View
                        style={{
                            paddingTop: PADDING_LARGE,
                            opacity: pushNotificationsEnabled ? 1 : 0.3,
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                    flex: 1,
                                }}
                            >
                                Social Notifications
                            </Text>
                            <SocialNotificationsSettings />
                        </View>

                        <View style={{ paddingTop: PADDING_LARGE }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                }}
                            >
                                Reminder Notifications
                            </Text>
                            <ReminderNotificationsSettings />
                        </View>

                        <View style={{ paddingTop: PADDING_LARGE }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                }}
                            >
                                Warning Notifications
                            </Text>
                            <WarningNotificationsSettings />
                        </View>

                        <View style={{ height: PADDING_LARGE }} />
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
