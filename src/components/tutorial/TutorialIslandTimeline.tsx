import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { TutorialIslandBanner } from './TutorialIslandBanner';

export const TutorialIslandTimeline = () => {
    return (
        <Screen>
            <TutorialIslandBanner
                name={'Timeline'}
                leftIcon={'people-outline'}
                leftRoute={'UserSearch'}
                innerLeftIcon={'add-outline'}
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
            />
        </Screen>
    );
};
