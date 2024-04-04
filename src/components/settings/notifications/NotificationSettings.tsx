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
import PushNotificationController, {
    PushNotificationCustomHooks,
} from 'src/controller/notification/PushNotificationController';

interface Props {
    children: React.ReactNode;
}

export const NotificationsSettings = ({ children }: Props) => {
    const socialNotificationsSetting = UserPropertyCustomHooks.useSocialNotificationSetting();
    const setting = socialNotificationsSetting.data ?? Constants.SocialNotificationSetting.ENABLED;

    const settingOffSelected =
        !enabledOnSystem || setting === Constants.SocialNotificationSetting.DISABLED;
    const settingOnSelected =
        enabledOnSystem && setting === Constants.SocialNotificationSetting.ENABLED;

    return <View>{children}</View>;
};
