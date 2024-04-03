import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { ReminderNotificationsSettingsElement } from './ReminderNotificationsSettingsElement';
import React from 'react';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';
import { UserCustomHooks } from 'src/controller/user/UserController';

export const ReminderNotificationsSettings = () => {
    const userIsPremium = UserCustomHooks.useUserIsPremium();

    const onUpdate = async (option: Constants.ReminderNotificationSetting) => {
        await UserPropertyController.setRemindersNotification(option);
        UserPropertyController.invalidateReminderNotification();
    };

    const reminderNotificationsSetting = UserPropertyCustomHooks.useReminderNotificationSetting();
    const setting =
        reminderNotificationsSetting.data ?? Constants.ReminderNotificationSetting.DAILY;

    return (
        <WidgetBase>
            <ReminderNotificationsSettingsElement
                title="Reminders Off"
                description="You will not receive any reminder notifications."
                option={Constants.ReminderNotificationSetting.DISABLED}
                selected={setting === Constants.ReminderNotificationSetting.DISABLED}
                onPress={onUpdate}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Daily Reminders"
                description="Receive a daily reminder on each day that you have habits scheduled."
                option={Constants.ReminderNotificationSetting.DAILY}
                selected={setting === Constants.ReminderNotificationSetting.DAILY}
                onPress={onUpdate}
            />
            <View style={{ height: PADDING_SMALL }} />

            <ReminderNotificationsSettingsElement
                title="Periodic Reminders"
                description="Receive reminder notifications for each Time Of Day that you have habits scheduled."
                premiumRequired
                hasPremium={userIsPremium}
                option={Constants.ReminderNotificationSetting.PERIODICALLY}
                selected={setting === Constants.ReminderNotificationSetting.PERIODICALLY}
                onPress={onUpdate}
            />
        </WidgetBase>
    );
};
