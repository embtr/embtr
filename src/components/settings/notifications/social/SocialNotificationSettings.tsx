import React from 'react';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { SocialNotificationsSettingsElement } from './SocialNotificationSettingsElement';
import { Constants } from 'resources/types/constants/constants';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';

export const SocialNotificationsSettings = () => {
    const onUpdate = async (option: Constants.SocialNotificationSetting) => {
        await UserPropertyController.setSocialNotification(option);
        UserPropertyController.invalidateSocialNotification();
    };

    const socialNotificationsSetting = UserPropertyCustomHooks.useSocialNotificationSetting();
    const setting = socialNotificationsSetting.data ?? Constants.SocialNotificationSetting.ENABLED;

    return (
        <WidgetBase>
            <SocialNotificationsSettingsElement
                title="Social Notifications Off"
                description="You will not receive any social notifications."
                option={Constants.SocialNotificationSetting.DISABLED}
                selected={setting === Constants.SocialNotificationSetting.DISABLED}
                onPress={onUpdate}
            />

            <View style={{ height: PADDING_SMALL }} />

            <SocialNotificationsSettingsElement
                title="Social Notifications On"
                description="Receive notifications for social interactions, such as comments and likes."
                option={Constants.SocialNotificationSetting.ENABLED}
                selected={setting === Constants.SocialNotificationSetting.ENABLED}
                onPress={onUpdate}
            />
        </WidgetBase>
    );
};
