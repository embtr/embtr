import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { ReminderNotificationsSettingsElement } from './ReminderNotificationsSettingsElement';
import React from 'react';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { Constants } from 'resources/types/constants/constants';

export const ReminderNotificationsSettings = () => {
    const [reminderNotificationsOption, setReminderNotificationsOption] =
        React.useState<Constants.ReminderNotificationsSetting>(
            Constants.ReminderNotificationsSetting.DAILY
        );

    return (
        <WidgetBase>
            <ReminderNotificationsSettingsElement
                title="Reminders Off"
                description="You will not receive any reminder notifications."
                option={Constants.ReminderNotificationsSetting.DISABLED}
                selected={
                    reminderNotificationsOption === Constants.ReminderNotificationsSetting.DISABLED
                }
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Daily Reminders"
                description="Receive a daily reminder on each day that you have habits scheduled."
                option={Constants.ReminderNotificationsSetting.DAILY}
                selected={
                    reminderNotificationsOption === Constants.ReminderNotificationsSetting.DAILY
                }
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Periodic Reminders"
                description="Receive reminder notifications for each Time Of Day that you have habits scheduled."
                premiumRequired
                option={Constants.ReminderNotificationsSetting.PERIODICALLY}
                selected={
                    reminderNotificationsOption ===
                    Constants.ReminderNotificationsSetting.PERIODICALLY
                }
                onPress={setReminderNotificationsOption}
            />
        </WidgetBase>
    );
};
