import React from 'react';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { SocialNotificationsSettingsElement } from './SocialNotificationSettingsElement';
import { Constants } from 'resources/types/constants/constants';

export const SocialNotificationsSettings = () => {
    const [reminderNotificationsOption, setReminderNotificationsOption] =
        React.useState<Constants.SocialNotificationsSetting>(
            Constants.SocialNotificationsSetting.ENABLED
        );

    return (
        <WidgetBase>
            <SocialNotificationsSettingsElement
                title="Social Notifications Off"
                description="You will not receive any social notifications."
                option={Constants.SocialNotificationsSetting.DISABLED}
                selected={
                    reminderNotificationsOption === Constants.SocialNotificationsSetting.DISABLED
                }
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <SocialNotificationsSettingsElement
                title="Social Notifications On"
                description="Receive notificaions for social interactions, such as comments and likes."
                option={Constants.SocialNotificationsSetting.ENABLED}
                selected={
                    reminderNotificationsOption === Constants.SocialNotificationsSetting.ENABLED
                }
                onPress={setReminderNotificationsOption}
            />
        </WidgetBase>
    );
};
