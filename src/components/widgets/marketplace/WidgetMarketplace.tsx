import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import React from 'react';
import UserController, { UserModel } from 'src/controller/user/UserController';
import {
    QUOTE_OF_THE_DAY_WIDGET,
    QUOTE_OF_THE_DAY_WIDGET_DESCRIPTION,
    TIME_LEFT_IN_DAY_WIDGET,
    TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION,
    TODAYS_NOTES_WIDGET,
    TODAYS_NOTES_WIDGET_DESCRIPTION,
    TODAYS_PHOTOS_WIDGET,
    TODAYS_PHOTOS_WIDGET_DESCRIPTION,
    TODAYS_TASKS_WIDGET,
    TODAYS_TASKS_WIDGET_DESCRIPTION,
    UPCOMING_GOALS_WIDGET,
    UPCOMING_GOALS_WIDGET_DESCRIPTION,
    WIDGETS,
} from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { WidgetMarketplaceToggle } from './WidgetMarketplaceToggle';

export const WidgetMarketplace = () => {
    const [user, setUser] = React.useState<UserModel>();

    React.useEffect(() => {
        const fetch = async () => {
            const user = await UserController.getCurrentUser();
            setUser(user);
        };

        fetch();
    }, []);

    const onToggle = (name: string, enabled: boolean) => {
        if (!user) {
            return;
        }

        let enabledWidgets: string[] = [];
        WIDGETS.forEach((widget) => {
            if (widget === name) {
                if (enabled) {
                    enabledWidgets.push(name);
                }
            } else if (user.today_widgets?.includes(widget)) {
                enabledWidgets.push(widget);
            }
        });

        let clonedUser = UserController.clone(user);
        clonedUser.today_widgets = enabledWidgets;
        UserController.update(clonedUser);
        setUser(clonedUser);
    };

    const isEnabled = (name: string) => {
        return user?.today_widgets?.includes(name) === true;
    };

    return (
        <Screen>
            <Banner name="Widget Marketplace" rightText={'close'} rightRoute="BACK" />

            <ScrollView>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ paddingTop: 10, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={TIME_LEFT_IN_DAY_WIDGET}
                            description={TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(TIME_LEFT_IN_DAY_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={QUOTE_OF_THE_DAY_WIDGET}
                            description={QUOTE_OF_THE_DAY_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(QUOTE_OF_THE_DAY_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={TODAYS_TASKS_WIDGET}
                            description={TODAYS_TASKS_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(TODAYS_TASKS_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={TODAYS_NOTES_WIDGET}
                            description={TODAYS_NOTES_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(TODAYS_NOTES_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={TODAYS_PHOTOS_WIDGET}
                            description={TODAYS_PHOTOS_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(TODAYS_PHOTOS_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                    <View style={{ paddingTop: 5, width: '100%' }}>
                        <WidgetMarketplaceToggle
                            name={UPCOMING_GOALS_WIDGET}
                            description={UPCOMING_GOALS_WIDGET_DESCRIPTION}
                            isEnabled={isEnabled(UPCOMING_GOALS_WIDGET)}
                            onToggle={onToggle}
                        />
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
