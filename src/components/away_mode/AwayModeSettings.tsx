import React from 'react';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { PADDING_SMALL } from 'src/util/constants';
import { View } from 'react-native';
import { Constants } from 'resources/types/constants/constants';
import {
    UserPropertyController,
    UserPropertyCustomHooks,
} from 'src/controller/user/UserPropertyController';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { AwayModeSettingsElement } from './AwayModeSettingsElement';

export const AwayModeSettings = () => {
    const userIsPremium = UserCustomHooks.useUserIsPremium();
    const awayModeSetting = UserPropertyCustomHooks.useAwayModeSetting();

    const onUpdate = async (option: Constants.AwayMode) => {
        await UserPropertyController.setAwayMode(option);
        UserController.invalidateCurrentUser();
        awayModeSetting.refetch();
    };

    const setting = awayModeSetting.data ?? Constants.AwayMode.DISABLED;

    return (
        <WidgetBase>
            <AwayModeSettingsElement
                title="I Am Here"
                description="Your habits are live and you're ready to crush them!"
                option={Constants.AwayMode.DISABLED}
                selected={setting !== Constants.AwayMode.ENABLED}
                onPress={onUpdate}
            />
            <View style={{ height: PADDING_SMALL }} />

            <AwayModeSettingsElement
                title="I Am Away"
                description="Pause your habits and preserve your streak data."
                option={Constants.AwayMode.ENABLED}
                selected={setting === Constants.AwayMode.ENABLED}
                onPress={onUpdate}
                premiumRequired
                hasPremium={userIsPremium}
            />
        </WidgetBase>
    );
};
