import { WidgetBase } from 'src/components/widgets/WidgetBase';
import {
    ReminderNotificationsSettingsElement,
    ReminderNotificationsSettingsOption,
} from './ReminderNotificationsSettingsElement';
import React from 'react';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';

export const ReminderNotificationsSettings = () => {
    const [reminderNotificationsOption, setReminderNotificationsOption] =
        React.useState<ReminderNotificationsSettingsOption>(
            ReminderNotificationsSettingsOption.OFF
        );

    return (
        <WidgetBase>
            <ReminderNotificationsSettingsElement
                title="Reminders Off"
                description="You will not receive any reminder notifications."
                option={ReminderNotificationsSettingsOption.OFF}
                selected={reminderNotificationsOption === ReminderNotificationsSettingsOption.OFF}
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Daily Reminders"
                description="Receive a daily reminder on each day that you have habits scheduled."
                option={ReminderNotificationsSettingsOption.DAILY}
                selected={reminderNotificationsOption === ReminderNotificationsSettingsOption.DAILY}
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Periodic Reminders"
                description="Receive reminder notifications for each Time Of Day that you have habits scheduled."
                premiumRequired
                option={ReminderNotificationsSettingsOption.TIME_OF_DAY}
                selected={
                    reminderNotificationsOption === ReminderNotificationsSettingsOption.TIME_OF_DAY
                }
                onPress={setReminderNotificationsOption}
            />
        </WidgetBase>
    );
};
