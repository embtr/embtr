import { WidgetBase } from 'src/components/widgets/WidgetBase';
import React from 'react';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
import { WarningNotificationsSettingsElement } from './WarningNotificationsSettingsElement';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';
import { UserCustomHooks } from 'src/controller/user/UserController';

export const WarningNotificationsSettings = () => {
    const userIsPremium = UserCustomHooks.useUserIsPremium();

    const onUpdate = async (option: Constants.WarningNotificationSetting) => {
        await UserPropertyController.setWarningsNotification(option);
        UserPropertyController.invalidateWarningNotification();
    };

    const warningNotificationsSetting = UserPropertyCustomHooks.useWarningNotificationSetting();
    const setting =
        warningNotificationsSetting.data ?? Constants.WarningNotificationSetting.DISABLED;

    return (
        <WidgetBase>
            <WarningNotificationsSettingsElement
                title="Warnings Off"
                description="You will not receive any warning notifications."
                option={Constants.WarningNotificationSetting.DISABLED}
                selected={setting === Constants.WarningNotificationSetting.DISABLED}
                onPress={onUpdate}
            />
            <View style={{ height: PADDING_SMALL }} />

            <WarningNotificationsSettingsElement
                title="Daily Warnings"
                description="Receive a warning at the end of the day warning you of any missed habits."
                premiumRequired
                userIsPremium={userIsPremium}
                option={Constants.WarningNotificationSetting.DAILY}
                selected={setting === Constants.WarningNotificationSetting.DAILY}
                onPress={onUpdate}
            />
            <View style={{ height: PADDING_SMALL }} />

            <WarningNotificationsSettingsElement
                title="Periodic Warnings"
                description="Receive warnings before each Time Of Day ends if you have missed any habits within it."
                premiumRequired
                userIsPremium={userIsPremium}
                option={Constants.WarningNotificationSetting.PERIODICALLY}
                selected={setting === Constants.WarningNotificationSetting.PERIODICALLY}
                onPress={onUpdate}
            />
        </WidgetBase>
    );
};
