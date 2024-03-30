import { WidgetBase } from 'src/components/widgets/WidgetBase';
import {
    ReminderNotificationsSettingsElement,
    ReminderNotificationsSettingsOption,
} from './ReminderNotificationsSettingsElement';
import React from 'react';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';

export const SocialNotificationsSettings = () => {
    const [reminderNotificationsOption, setReminderNotificationsOption] =
        React.useState<ReminderNotificationsSettingsOption>(
            ReminderNotificationsSettingsOption.OFF
        );

    return (
        <WidgetBase>
            <ReminderNotificationsSettingsElement
                title="Social Notifications Off"
                description="You will not receive any social notifications."
                option={ReminderNotificationsSettingsOption.OFF}
                selected={reminderNotificationsOption === ReminderNotificationsSettingsOption.OFF}
                onPress={setReminderNotificationsOption}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Social Notifications On"
                description="Receive notificaions for social interactions, such as comments and likes."
                option={ReminderNotificationsSettingsOption.DAILY}
                selected={reminderNotificationsOption === ReminderNotificationsSettingsOption.DAILY}
                onPress={setReminderNotificationsOption}
            />
        </WidgetBase>
    );
};
